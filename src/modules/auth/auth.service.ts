import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { envConfig } from '../../config/env.config';
import { AuthDao } from './auth.dao';
import { RegisterDto, LoginDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto } from './auth.dto';
import { IUser } from '../user/user.model';
import { mailService } from '../../services/mail.service';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  private authDao: AuthDao;

  constructor() {
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

  async register(
    registerData: RegisterDto
  ): Promise<{ success: boolean; message: string; user?: IUser; accessToken?: string; refreshToken?: string }> {
    const existingUser = await this.authDao.findUserByEmail(registerData.email);

    if (existingUser) {
      return {
        success: false,
        message: 'User with this email already exists',
      };
    }

    const user = await this.authDao.createUser(registerData);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await this.authDao.updateUserEmailVerificationToken(user._id.toString(), verificationToken, expiresAt);
    await mailService.sendVerificationEmail(registerData.email, verificationToken, registerData.name);

    const { accessToken, refreshToken } = await this.generateTokenPair(user._id.toString());

    return {
      success: true,
      message: 'Please verify your email.',
      user,
      accessToken,
      refreshToken,
    };
  }

  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    const user = await this.authDao.findUserByEmailVerificationToken(token);

    if (!user || !user.emailVerificationToken || !user.emailVerificationExpires) {
      return { success: false, message: 'Invalid or expired verification token' };
    }

    if (user.emailVerificationExpires < new Date()) {
      return { success: false, message: 'Verification token has expired' };
    }

    await this.authDao.setUserEmailVerified(user._id.toString());
    return { success: true, message: 'Email verified successfully' };
  }

  async login(
    loginData: LoginDto
  ): Promise<{ success: boolean; message: string; user?: IUser; accessToken?: string; refreshToken?: string }> {
    const user = await this.authDao.findUserByEmail(loginData.email);

    if (!user) {
      return {
        success: false,
        message: 'Invalid email or password',
      };
    }

    const isPasswordValid = await this.authDao.verifyPassword(loginData.password, user.password);

    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Invalid email or password',
      };
    }

    const { accessToken, refreshToken } = await this.generateTokenPair(user._id.toString());

    return {
      success: true,
      message: 'Login successful',
      user,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshTokenData: RefreshTokenDto): Promise<{ success: boolean; message: string; userId?: string }> {
    const refreshToken = await this.authDao.findRefreshToken(refreshTokenData.refreshToken);

    if (!refreshToken) {
      return {
        success: false,
        message: 'Invalid refresh token',
      };
    }

    // Check if token is expired
    if (refreshToken.expiresAt < new Date()) {
      await this.authDao.deleteRefreshToken(refreshTokenData.refreshToken);
      return {
        success: false,
        message: 'Refresh token expired',
      };
    }

    // Get user ID from refresh token
    const userId = refreshToken.userId.toString();

    return {
      success: true,
      message: 'Token refresh successful',
      userId,
    };
  }

  async logout(refreshToken: string): Promise<{ success: boolean; message: string }> {
    await this.authDao.deleteRefreshToken(refreshToken);

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  async forgotPassword(data: ForgotPasswordDto): Promise<{ success: boolean; message: string }> {
    const user = await this.authDao.findUserByEmail(data.email);

    if (user) {
      const rawToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      await this.authDao.updateUserPasswordResetToken(user._id.toString(), hashedToken, expiresAt);
      await mailService.sendPasswordResetEmail(user.email, rawToken, user.name);
    }

    return {
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link.',
    };
  }

  async resetPassword(data: ResetPasswordDto): Promise<{ success: boolean; message: string }> {
    const hashedToken = crypto.createHash('sha256').update(data.token).digest('hex');
    const user = await this.authDao.findUserByPasswordResetToken(hashedToken);

    if (!user || !user.passwordResetToken || !user.passwordResetExpires) {
      return { success: false, message: 'Invalid or expired token' };
    }

    if (user.passwordResetExpires < new Date()) {
      return { success: false, message: 'Invalid or expired token' };
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await this.authDao.updateUserPassword(user._id.toString(), hashedPassword);
    await this.authDao.clearUserPasswordReset(user._id.toString());
    await this.authDao.deleteAllRefreshTokensForUser(user._id.toString());

    return { success: true, message: 'Password reset successfully' };
  }
}
