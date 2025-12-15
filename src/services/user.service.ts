/**
 * User Service
 * 
 * This file contains all business logic related to User operations.
 * The Service layer coordinates between Controllers and DAOs,
 * handles business rules, data transformations, and application-level logic.
 * It does NOT directly access the database - that's the DAO's responsibility.
 */

import { userDao } from '../dao/user.dao';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
  LoginUserDto,
  AuthResponseDto,
} from '../dto/user.dto';
import { IUser } from '../models/user.model';
import { logger } from '../utils/logger';
import jwt from 'jsonwebtoken';
import { envConfig } from '../config/env.config';
import { BASIC_PERMISSIONS, Role } from '../constants/permissions';
import { userPermissionDao } from '../dao/user-permission.dao';

/**
 * Custom error class for business logic errors
 */
export class ServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

/**
 * User Service class
 * Contains all business logic for user operations
 */
class UserService {
  /**
   * Creates a new user
   * Business logic: Check if user already exists, validate data, create user
   * @param userData - User data to create
   * @returns Promise<UserResponseDto> - The created user (without password)
   * @throws ServiceError - If user already exists or validation fails
   */
  public async createUser(userData: CreateUserDto): Promise<UserResponseDto> {
    try {
      // Business rule: Check if user with email already exists
      const existingUser = await userDao.existsByEmail(userData.email);
      if (existingUser) {
        throw new ServiceError('User with this email already exists', 409);
      }

      // Create user through DAO
      const user = await userDao.create(userData);
      await this.updateUserPermissions(user.email);

      // Transform to response DTO (exclude password)
      return this.mapToUserResponseDto(user);
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      logger.error('Error creating user:', error);
      throw new ServiceError('Failed to create user', 500);
    }
  }

  public async updateUserPermissions(email: string, permissions?: any[]): Promise<void> {
    try {
      if (!email) {
        throw new ServiceError('Email is required to update permissions', 400);
      }

      const user = await userDao.findByEmail(email);
      if (!user) {
        throw new ServiceError('User not found', 404);
      }

      // update permissions logic here
      const permissionJSON = (permissions || BASIC_PERMISSIONS).map(p => p.name);

      await userPermissionDao.bulkPermissionUpdateByEmail(email, permissionJSON);
      return;
    } catch (error) {
      logger.error('Error updating user permissions:', error);
      throw new ServiceError('Failed to update user permissions', 500);
    }
  }

  /**
   * Gets a user by ID
   * Business logic: Validate ID format, fetch user, handle not found
   * @param id - User ID
   * @returns Promise<UserResponseDto> - The user data
   * @throws ServiceError - If user not found
   */
  public async getUserById(id: string): Promise<UserResponseDto> {
    try {
      const user = await userDao.findById(id);
      if (!user) {
        throw new ServiceError('User not found', 404);
      }

      return this.mapToUserResponseDto(user);
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      logger.error('Error fetching user:', error);
      throw new ServiceError('Failed to fetch user', 500);
    }
  }

  /**
   * Gets all users with pagination
   * @param page - Page number
   * @param limit - Items per page
   */
  public async getAllUsers(
    page: number = 1,
    limit: number = 10
  ): Promise<{ users: UserResponseDto[]; total: number }> {
    try {
      const { users, total } = await userDao.findAll(page, limit);
      const mapped = users.map((u) => this.mapToUserResponseDto(u));
      return { users: mapped, total };
    } catch (error) {
      logger.error('Error fetching users:', error);
      throw new ServiceError('Failed to fetch users', 500);
    }
  }

  /**
   * Gets a user by email
   * @param email - User email
   */
  public async getUserByEmail(email: string): Promise<UserResponseDto> {
    try {
      const user = await userDao.findByEmail(email);
      if (!user) {
        throw new ServiceError('User not found', 404);
      }

      return this.mapToUserResponseDto(user);
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      logger.error('Error fetching user by email:', error);
      throw new ServiceError('Failed to fetch user', 500);
    }
  }

  /**
   * Updates a user by ID
   * Business logic: Validate user exists, check email uniqueness if email is being updated
   * @param id - User ID
   * @param updateData - Data to update
   * @returns Promise<UserResponseDto> - The updated user data
   * @throws ServiceError - If user not found or email conflict
   */
  public async updateUser(
    id: string,
    updateData: UpdateUserDto
  ): Promise<UserResponseDto> {
    try {
      // Business rule: If email is being updated, check if new email is already taken
      if (updateData.email) {
        const existingUser = await userDao.findByEmail(updateData.email);
        if (existingUser && existingUser._id.toString() !== id) {
          throw new ServiceError('Email is already in use', 409);
        }
      }

      const user = await userDao.updateById(id, updateData);
      if (!user) {
        throw new ServiceError('User not found', 404);
      }

      return this.mapToUserResponseDto(user);
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      logger.error('Error updating user:', error);
      throw new ServiceError('Failed to update user', 500);
    }
  }

  /**
   * Deletes a user by ID
   * Business logic: Validate user exists before deletion
   * @param id - User ID
   * @returns Promise<void>
   * @throws ServiceError - If user not found
   */
  public async deleteUser(id: string): Promise<void> {
    try {
      const user = await userDao.deleteById(id);
      if (!user) {
        throw new ServiceError('User not found', 404);
      }
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      logger.error('Error deleting user:', error);
      throw new ServiceError('Failed to delete user', 500);
    }
  }

  /**
   * Authenticates a user and generates JWT token
   * Business logic: Validate credentials, generate token
   * @param loginData - Login credentials
   * @returns Promise<AuthResponseDto> - User data and JWT token
   * @throws ServiceError - If credentials are invalid
   */
  public async login(loginData: LoginUserDto): Promise<AuthResponseDto> {
    try {
      // Find user with password (needed for comparison)
      const user = await userDao.findByEmailWithPassword(loginData.email);
      if (!user) {
        throw new ServiceError('Invalid email or password', 401);
      }

      // Compare password
      const isPasswordValid = await user.comparePassword(loginData.password);
      if (!isPasswordValid) {
        throw new ServiceError('Invalid email or password', 401);
      }

      let permissions: any = await userPermissionDao.getUserPermissions(user.email);
      if (permissions.length) {
        permissions = permissions.map((p: any) => p.permissionName);
      }

      // Generate JWT token
      const token = this.generateToken(
        user._id.toString(),
        user.email,
        user.role,
        permissions
      );

      return {
        user: this.mapToUserResponseDto(user),
        permissions: permissions ?? [],
        token,
      };
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      logger.error('Error during login:', error);
      throw new ServiceError('Login failed', 500);
    }
  }

  /**
   * Generates a JWT token for a user
   * @param userId - User ID
   * @param email - User email
   * @param role - User role
   * @returns string - JWT token
   */
  private generateToken(userId: string, email: string, role: Role, permissions: string[]): string {
    const payload = {
      id: userId,
      email,
      role,
      permissions
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return jwt.sign(payload, envConfig.JWT_SECRET, {
      expiresIn: envConfig.JWT_EXPIRES_IN,
    } as any);
  }

  /**
   * Maps IUser document to UserResponseDto
   * Transforms database model to response DTO (excludes password)
   * @param user - User document from database
   * @returns UserResponseDto - User response data
   */
  private mapToUserResponseDto(user: IUser): UserResponseDto {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

// Export a singleton instance
export const userService = new UserService();

