/**
 * Auth Service
 * 
 * This file contains business logic for authentication.
 * Handles user registration, login, and profile management.
 */

import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { envConfig } from '../../config/env.config';
import { authDao } from '../dao/auth.dao';
import {
  RegisterDto,
  LoginDto,
  UpdateProfileDto,
  UserResponseDto,
  AuthResponseDto,
  RefreshTokenDto,
  RefreshTokenResponseDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from '../dto/auth.dto';
import { IUser } from '../models/auth.model';
import { ServiceError } from '../../shared/exceptions/service.error';
import { emailService } from '../../shared/utils/email.service';
import {
  passwordResetTemplate,
  welcomeTemplate,
} from '../../shared/utils/email.templates';

/**
 * Auth service class
 * Contains business logic for authentication operations
 */
class AuthService {
  /**
   * Generate access token (short-lived)
   */
  private generateAccessToken(user: IUser): string {
    const payload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    };

    return jwt.sign(payload, envConfig.JWT_SECRET, {
      expiresIn: envConfig.JWT_EXPIRES_IN || '15m',
    } as SignOptions);
  }

  /**
   * Generate refresh token (long-lived)
   */
  private generateRefreshToken(user: IUser): string {
    const payload = {
      id: user._id.toString(),
      type: 'refresh',
    };

    return jwt.sign(payload, envConfig.JWT_REFRESH_SECRET, {
      expiresIn: envConfig.JWT_REFRESH_EXPIRES_IN || '7d',
    } as SignOptions);
  }

  /**
   * Convert user to response DTO
   */
  private toUserResponseDto(user: IUser): UserResponseDto {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Register a new user
   */
  async register(data: RegisterDto): Promise<AuthResponseDto> {
    // Check if email already exists
    const emailExists = await authDao.emailExists(data.email);
    if (emailExists) {
      throw new ServiceError('Email already registered', 409);
    }

    // Create user
    const user = await authDao.create({
      name: data.name,
      email: data.email,
      password: data.password,
      role: ['user'],
      permissions: [],
    });

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Save refresh token to database
    await authDao.updateRefreshToken(user._id.toString(), refreshToken);

    // Send welcome email (non-blocking)
    this.sendWelcomeEmail(user).catch((error) => {
      // Log error but don't fail registration
      console.error('Failed to send welcome email:', error);
    });

    return {
      user: this.toUserResponseDto(user),
      token: accessToken,
      refreshToken,
    };
  }

  /**
   * Login user
   */
  async login(data: LoginDto): Promise<AuthResponseDto> {
    // Find user with password
    const user = await authDao.findByEmail(data.email, true);
    if (!user) {
      throw new ServiceError('Invalid email.', 401);
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(data.password);
    if (!isPasswordValid) {
      throw new ServiceError('Invalid password.', 401);
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Save refresh token to database
    await authDao.updateRefreshToken(user._id.toString(), refreshToken);

    return {
      user: this.toUserResponseDto(user),
      token: accessToken,
      refreshToken,
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<UserResponseDto> {
    const user = await authDao.findById(id);
    if (!user) {
      throw new ServiceError('User not found', 404);
    }

    return this.toUserResponseDto(user);
  }

  /**
   * Update user profile
   */
  async updateProfile(
    id: string,
    data: UpdateProfileDto
  ): Promise<UserResponseDto> {
    // Check if email is being updated and if it already exists
    if (data.email) {
      const existingUser = await authDao.findByEmail(data.email);
      if (existingUser && existingUser._id.toString() !== id) {
        throw new ServiceError('Email already in use', 409);
      }
    }

    // Update user
    const user = await authDao.updateById(id, data);
    if (!user) {
      throw new ServiceError('User not found', 404);
    }

    return this.toUserResponseDto(user);
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<void> {
    const user = await authDao.deleteById(id);
    if (!user) {
      throw new ServiceError('User not found', 404);
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(data: RefreshTokenDto): Promise<RefreshTokenResponseDto> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(
        data.refreshToken,
        envConfig.JWT_REFRESH_SECRET
      ) as { id: string; type?: string };

      // Check if token is a refresh token
      if (decoded.type !== 'refresh') {
        throw new ServiceError('Invalid token type', 401);
      }

      // Find user by refresh token
      const user = await authDao.findByRefreshToken(data.refreshToken);
      if (!user) {
        throw new ServiceError('Invalid or expired refresh token', 401);
      }

      // Generate new tokens
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      // Update refresh token in database
      await authDao.updateRefreshToken(user._id.toString(), refreshToken);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error: any) {
      if (error instanceof ServiceError) {
        throw error;
      }
      if (error.name === 'TokenExpiredError') {
        throw new ServiceError('Refresh token has expired', 401);
      }
      if (error.name === 'JsonWebTokenError') {
        throw new ServiceError('Invalid refresh token', 401);
      }
      throw new ServiceError('Token refresh failed', 500);
    }
  }

  /**
   * Logout user (clear refresh token)
   */
  async logout(userId: string): Promise<void> {
    await authDao.clearRefreshToken(userId);
  }

  /**
   * Generate password reset token
   */
  private generateResetToken(): string {
    // Generate a random token (32 bytes = 64 hex characters)
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Forgot password - generate and send reset token
   */
  async forgotPassword(data: ForgotPasswordDto): Promise<void> {
    const user = await authDao.findByEmail(data.email);

    // Always return success to prevent email enumeration
    // Don't reveal if email exists or not
    if (!user) {
      return; // Silent fail for security
    }

    // Generate reset token
    const resetToken = this.generateResetToken();
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Token expires in 1 hour

    // Save reset token to database
    await authDao.setResetToken(
      user._id.toString(),
      resetToken,
      resetTokenExpiry
    );

    // Send password reset email
    await this.sendPasswordResetEmail(user, resetToken);
  }

  /**
   * Reset password using reset token
   */
  async resetPassword(data: ResetPasswordDto): Promise<void> {
    // Find user by reset token
    const user = await authDao.findByResetToken(data.token);
    if (!user) {
      throw new ServiceError('Invalid or expired reset token', 400);
    }

    // Update password (will be hashed by pre-save hook)
    await authDao.updateById(user._id.toString(), {
      password: data.password,
    });

    // Clear reset token
    await authDao.clearResetToken(user._id.toString());

    // Clear refresh token for security (force re-login)
    await authDao.clearRefreshToken(user._id.toString());
  }

  /**
   * Change password (requires current password)
   */
  async changePassword(
    userId: string,
    data: ChangePasswordDto
  ): Promise<void> {
    // Find user with password
    const user = await authDao.findById(userId);
    if (!user) {
      throw new ServiceError('User not found', 404);
    }

    // Get user with password field
    const userWithPassword = await authDao.findByEmail(user.email, true);
    if (!userWithPassword) {
      throw new ServiceError('User not found', 404);
    }

    // Verify current password
    const isPasswordValid = await userWithPassword.comparePassword(
      data.currentPassword
    );
    if (!isPasswordValid) {
      throw new ServiceError('Current password is incorrect', 401);
    }

    // Check if new password is different from current password
    const isSamePassword = await userWithPassword.comparePassword(
      data.newPassword
    );
    if (isSamePassword) {
      throw new ServiceError(
        'New password must be different from current password',
        400
      );
    }

    // Update password (will be hashed by pre-save hook)
    await authDao.updateById(userId, {
      password: data.newPassword,
    });

    // Clear refresh token for security (force re-login)
    await authDao.clearRefreshToken(userId);
  }

  /**
   * Send welcome email to newly registered user
   */
  private async sendWelcomeEmail(user: IUser): Promise<void> {
    try {
      const loginLink = `${envConfig.APP_URL}/auth/login`;
      const template = welcomeTemplate({
        name: user.name,
        loginLink,
      });

      const emailSent = await emailService.sendEmailWithBoth(
        user.email,
        'Welcome to App ' + new Date().getFullYear() + '!',
        template.html,
        template.text
      );

      if (emailSent) {
        console.log(`Welcome email sent successfully to user: ${user.email}`);
      } else {
        console.warn(`Failed to send welcome email to user: ${user.email}. Check SMTP configuration.`);
      }
    } catch (error) {
      // Log error but don't throw - email failure shouldn't break registration
      console.error('Error sending welcome email:', error);
    }
  }

  /**
   * Send password reset email
   */
  private async sendPasswordResetEmail(
    user: IUser,
    resetToken: string
  ): Promise<void> {
    try {
      const resetLink = `${envConfig.APP_URL}/reset-password?token=${resetToken}`;
      const template = passwordResetTemplate({
        name: user.name,
        resetLink,
        expiryMinutes: 60, // Token expires in 1 hour
      });

      const emailSent = await emailService.sendEmailWithBoth(
        user.email,
        'Password Reset Request',
        template.html,
        template.text
      );

      if (emailSent) {
        console.log(`Password reset email sent successfully to user: ${user.email}`);
      } else {
        console.warn(`Failed to send password reset email to user: ${user.email}. Check SMTP configuration.`);
      }
    } catch (error) {
      // Log error but don't throw - email failure shouldn't break password reset flow
      // The token is still saved, user can request again if email fails
      console.error('Error sending password reset email:', error);
    }
  }
}

// Export a singleton instance
export const authService = new AuthService();

