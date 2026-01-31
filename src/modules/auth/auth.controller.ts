import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { envConfig } from '../../config/env.config';
import { AuthService } from './auth.service';
import { AuthDao } from './auth.dao';
import { RegisterDto, LoginDto, RefreshTokenDto } from './auth.dto';

export class AuthController {
  private authService: AuthService;
  private authDao: AuthDao;

  constructor() {
    this.authService = new AuthService();
    this.authDao = new AuthDao();
  }

  /**
   * Generate access token (short-lived)
   */
  private generateAccessToken(userId: string): string {
    return jwt.sign(
      { userId },
      envConfig.JWT_SECRET,
      {
        expiresIn: envConfig.JWT_EXPIRES_IN,
      } as SignOptions
    );
  }

  /**
   * Generate refresh token (long-lived)
   */
  private generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  /**
   * Generate both tokens and save refresh token to database
   */
  private async generateTokenPair(userId: string): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.generateAccessToken(userId);
    const refreshToken = this.generateRefreshToken();

    // Calculate expiration date for refresh token (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(
      expiresAt.getDate() +
      parseInt(envConfig.JWT_REFRESH_EXPIRES_IN, 10)
    );

    // Save refresh token to database
    await this.authDao.createRefreshToken(userId, refreshToken, expiresAt);

    return { accessToken, refreshToken };
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const registerData: RegisterDto = req.body;

      const result = await this.authService.register(registerData);

      if (!result.success || !result.user) {
        res.status(400).json({
          success: false,
          message: result.message,
        });
        return;
      }

      // Generate token pair
      const { accessToken, refreshToken } = await this.generateTokenPair(result.user._id.toString());

      res.status(201).json({
        success: true,
        message: result.message,
        data: {
          user: {
            id: result.user._id.toString(),
            name: result.user.name,
            email: result.user.email,
          },
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const loginData: LoginDto = req.body;

      const result = await this.authService.login(loginData);

      if (!result.success || !result.user) {
        res.status(401).json({
          success: false,
          message: result.message,
        });
        return;
      }

      // Generate token pair
      const { accessToken, refreshToken } = await this.generateTokenPair(result.user._id.toString());

      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          user: {
            id: result.user._id.toString(),
            name: result.user.name,
            email: result.user.email,
          },
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshTokenData: RefreshTokenDto = req.body;

      const result = await this.authService.refreshToken(refreshTokenData);

      if (!result.success || !result.userId) {
        res.status(401).json({
          success: false,
          message: result.message,
        });
        return;
      }

      // Delete old refresh token
      await this.authDao.deleteRefreshToken(refreshTokenData.refreshToken);

      // Generate new token pair
      const { accessToken, refreshToken } = await this.generateTokenPair(result.userId);

      res.status(200).json({
        success: true,
        message: 'Tokens refreshed successfully',
        data: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshTokenData: RefreshTokenDto = req.body;

      const result = await this.authService.logout(refreshTokenData.refreshToken);

      if (!result.success) {
        res.status(400).json({
          success: false,
          message: result.message,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  };
}
