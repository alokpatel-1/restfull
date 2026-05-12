import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { envConfig } from '../../config/env.config';
import { AuthService } from './auth.service';
import { AuthDao } from './auth.dao';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './auth.dto';
import { AuthTokens, CookieOptions, LoggedInUserData } from './auth.types';

export class AuthController {
  private authService: AuthService;
  private authDao: AuthDao;

  constructor() {
    this.authService = new AuthService();
    this.authDao = new AuthDao();
  }

  private generateAccessToken(userId: string): string {
    return jwt.sign(
      { userId },
      envConfig.JWT_SECRET,
      { expiresIn: envConfig.JWT_EXPIRES_IN } as SignOptions
    );
  }

  private async generateTokenPair(userId: string): Promise<AuthTokens> {
    const accessToken = this.generateAccessToken(userId);
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(envConfig.JWT_REFRESH_EXPIRES_IN, 10));
    await this.authDao.createRefreshToken(userId, refreshToken, expiresAt);
    return { accessToken, refreshToken };
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const registerData: RegisterDto = req.body;
      const result = await this.authService.register(registerData);

      if (!result.success || !result.user) {
        res.status(400).json({ success: false, code: result.code, message: result.message });
        return;
      }

      res.status(201).json({
        success: true,
        code: result.code,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  };

  private getCookieOptions(maxAgeMs: number, httpOnly = true): CookieOptions {
    return {
      httpOnly,
      secure: true, // required when sameSite is 'none'; localhost is treated as secure
      sameSite: 'none', // required so cookies are sent on cross-origin requests (e.g. frontend :4200 -> API :3000)
      maxAge: maxAgeMs,
      path: '/',
    };
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const loginData: LoginDto = req.body;
      const result = await this.authService.login(loginData);

      if (!result.success || !result.user) {
        res.status(401).json({ success: false, code: result.code, message: result.message });
        return;
      }

      const accessTokenMaxAge = 15 * 60 * 1000;
      const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000;

      const userData: LoggedInUserData = {
        id: result.user._id.toString(),
        name: result.user.name,
        email: result.user.email,
        emailVerified: result.user.emailVerified ?? false,
        role: result.roleDetails?.map((role) => role.name) ?? [],
        permissions: result.permissions ?? [],
      };

      res.cookie('accessToken', result.accessToken, this.getCookieOptions(accessTokenMaxAge));
      res.cookie('refreshToken', result.refreshToken, this.getCookieOptions(refreshTokenMaxAge));
      res.cookie(
        'userData',
        Buffer.from(JSON.stringify(userData), 'utf-8').toString('base64url'),
        this.getCookieOptions(accessTokenMaxAge)
      );

      res.status(200).json({
        success: true,
        code: result.code,
        message: result.message,
        data: {
          user: userData,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = (req.query.token as string) || req.body?.token;

      if (!token) {
        res.status(400).json({ success: false, message: 'Verification token is required' });
        return;
      }

      const result = await this.authService.verifyEmail(token);

      if (!result.success) {
        res.status(400).json({ success: false, message: result.message });
        return;
      }

      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      next(error);
    }
  };

  verifyAuthToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Token passed from angular app in query params (or authorization header/cookie as fallback)
      const token = (req.query.token as string) || req.headers.authorization?.split(' ')[1] || req.cookies?.accessToken;

      if (!token) {
        res.status(401).json({ success: false, message: 'No token provided' });
        return;
      }

      const decoded = jwt.verify(token, envConfig.JWT_SECRET) as { userId: string };

      const result = await this.authService.getUserData(decoded.userId);

      if (!result.success || !result.user) {
        res.status(401).json({ success: false, message: result.message });
        return;
      }

      const userData: LoggedInUserData = {
        id: result.user._id.toString(),
        name: result.user.name,
        email: result.user.email,
        emailVerified: result.user.emailVerified ?? false,
        role: result.roleDetails?.map((role) => role.name) ?? [],
        permissions: result.permissions ?? [],
      };

      res.status(200).json({
        success: true,
        code: 'LOGIN_SUCCESS',
        message: 'Token verified successfully',
        data: {
          user: userData,
        },
      });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
        return;
      }
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshToken = req.body.refreshToken ?? req.cookies?.refreshToken;

      if (!refreshToken) {
        res.status(401).json({ success: false, message: 'Refresh token is required' });
        return;
      }

      const result = await this.authService.refreshToken({ refreshToken });

      if (!result.success || !result.userId) {
        res.status(401).json({ success: false, message: result.message });
        return;
      }

      await this.authDao.deleteRefreshToken(refreshToken);
      const { accessToken, refreshToken: newRefreshToken } = await this.generateTokenPair(result.userId);

      const accessTokenMaxAge = 15 * 60 * 1000;
      const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000;
      res.cookie('accessToken', accessToken, this.getCookieOptions(accessTokenMaxAge));
      res.cookie('refreshToken', newRefreshToken, this.getCookieOptions(refreshTokenMaxAge));

      res.status(200).json({
        success: true,
        message: 'Tokens refreshed successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshToken = req.body.refreshToken ?? req.cookies?.refreshToken;

      if (refreshToken) {
        await this.authService.logout(refreshToken);
      }

      res.clearCookie('accessToken', { path: '/' });
      res.clearCookie('refreshToken', { path: '/' });
      res.clearCookie('userData', { path: '/' });

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: ForgotPasswordDto = req.body;
      const result = await this.authService.forgotPassword(data);
      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: ResetPasswordDto = req.body;
      const result = await this.authService.resetPassword(data);

      if (!result.success) {
        res.status(400).json({ success: false, message: result.message });
        return;
      }

      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      next(error);
    }
  };
}
