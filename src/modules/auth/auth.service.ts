import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { envConfig } from '../../config/env.config';
import { AuthDao } from './auth.dao';
import { RegisterDto, LoginDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto } from './auth.dto';
import {
  AuthCode,
  AuthMessageResult,
  AuthTokens,
  RegisterResult,
  LoginResult,
  RefreshTokenResult,
} from './auth.types';
import { mailService } from '../../services/mail.service';

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

  async register(registerData: RegisterDto): Promise<RegisterResult> {
    const existingUser = await this.authDao.findUserByEmail(registerData.email);

    if (existingUser) {
      return {
        success: false,
        code: AuthCode.USER_ALREADY_EXISTS,
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
      code: AuthCode.REGISTRATION_SUCCESS,
      message: 'Registration successful. You receive a mail verification link on your given email. Please verify this to login.',
      user,
      accessToken,
      refreshToken,
    };
  }

  async verifyEmail(token: string): Promise<AuthMessageResult> {
    const user = await this.authDao.findUserByEmailVerificationToken(token);

    if (!user || !user.emailVerificationToken || !user.emailVerificationExpires) {
      return { success: false, code: AuthCode.VERIFICATION_INVALID, message: 'Invalid or expired verification token' };
    }

    if (user.emailVerificationExpires < new Date()) {
      return { success: false, code: AuthCode.VERIFICATION_EXPIRED, message: 'Verification token has expired' };
    }

    await this.authDao.setUserEmailVerified(user._id.toString());
    return { success: true, code: AuthCode.VERIFICATION_SUCCESS, message: 'Email verified successfully' };
  }

  async login(loginData: LoginDto): Promise<LoginResult> {
    const user = await this.authDao.findUserByEmail(loginData.email);

    if (!user) {
      return {
        success: false,
        code: AuthCode.INVALID_EMAIL,
        message: 'Invalid email',
      };
    }

    const isPasswordValid = await this.authDao.verifyPassword(loginData.password, user.password);

    if (!isPasswordValid) {
      return {
        success: false,
        code: AuthCode.INVALID_CREDENTIALS,
        message: 'Invalid password',
      };
    }

    if (!user.emailVerified) {
      return {
        success: false,
        code: AuthCode.EMAIL_NOT_VERIFIED,
        message: 'Please verify your email before signing in.',
      };
    }

    if (!user.isActive || user.isDeleted) {
      return {
        success: false,
        code: AuthCode.ACCOUNT_INACTIVE,
        message: 'Your account is inactive or has been deactivated. Please contact support.',
      };
    }

    const { accessToken, refreshToken } = await this.generateTokenPair(user._id.toString());
    const { roleDetails, permissions } = await this.authDao.getRolesAndPermissions(user._id.toString());

    return {
      success: true,
      code: AuthCode.LOGIN_SUCCESS,
      message: 'Login successful',
      user,
      accessToken,
      refreshToken,
      roleDetails,
      permissions,
    };
  }

  async refreshToken(refreshTokenData: RefreshTokenDto): Promise<RefreshTokenResult> {
    const refreshToken = await this.authDao.findRefreshToken(refreshTokenData.refreshToken);

    if (!refreshToken) {
      return {
        success: false,
        code: AuthCode.REFRESH_TOKEN_INVALID,
        message: 'Invalid refresh token',
      };
    }

    if (refreshToken.expiresAt < new Date()) {
      await this.authDao.deleteRefreshToken(refreshTokenData.refreshToken);
      return {
        success: false,
        code: AuthCode.REFRESH_TOKEN_EXPIRED,
        message: 'Refresh token expired',
      };
    }

    const userId = refreshToken.userId.toString();

    return {
      success: true,
      code: AuthCode.REFRESH_SUCCESS,
      message: 'Token refresh successful',
      userId,
    };
  }

  async logout(refreshToken: string): Promise<AuthMessageResult> {
    await this.authDao.deleteRefreshToken(refreshToken);

    return {
      success: true,
      code: AuthCode.LOGOUT_SUCCESS,
      message: 'Logged out successfully',
    };
  }

  async forgotPassword(data: ForgotPasswordDto): Promise<AuthMessageResult> {
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
      code: AuthCode.FORGOT_PASSWORD_SUCCESS,
      message: 'If an account exists with this email, you will receive a password reset link.',
    };
  }

  async resetPassword(data: ResetPasswordDto): Promise<AuthMessageResult> {
    const hashedToken = crypto.createHash('sha256').update(data.token).digest('hex');
    const user = await this.authDao.findUserByPasswordResetToken(hashedToken);

    if (!user || !user.passwordResetToken || !user.passwordResetExpires) {
      return { success: false, code: AuthCode.RESET_PASSWORD_INVALID, message: 'Invalid or expired token' };
    }

    if (user.passwordResetExpires < new Date()) {
      return { success: false, code: AuthCode.RESET_PASSWORD_INVALID, message: 'Invalid or expired token' };
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await this.authDao.updateUserPassword(user._id.toString(), hashedPassword);
    await this.authDao.clearUserPasswordReset(user._id.toString());
    await this.authDao.deleteAllRefreshTokensForUser(user._id.toString());

    return { success: true, code: AuthCode.RESET_PASSWORD_SUCCESS, message: 'Password reset successfully' };
  }
}
