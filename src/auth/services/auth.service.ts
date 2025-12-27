/**
 * Auth Service
 * 
 * This file contains business logic for authentication.
 * Handles user registration, login, and profile management.
 */

import jwt, { SignOptions } from 'jsonwebtoken';
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
} from '../dto/auth.dto';
import { IUser } from '../models/auth.model';
import { ServiceError } from '../../shared/exceptions/service.error';

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
      role: 'user',
      permissions: [],
    });

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
}

// Export a singleton instance
export const authService = new AuthService();

