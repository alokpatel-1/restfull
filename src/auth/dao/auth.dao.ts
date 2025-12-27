/**
 * Auth DAO (Data Access Object)
 * 
 * This file contains database access methods for authentication.
 * Handles all database operations related to users.
 */

import User, { IUser } from '../models/auth.model';

/**
 * Auth DAO class
 * Contains methods for user database operations
 */
class AuthDao {
  /**
   * Create a new user
   */
  async create(userData: {
    name: string;
    email: string;
    password: string;
    role?: string[];
    permissions?: string[];
  }): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  /**
   * Find user by email (only active and not deleted users)
   */
  async findByEmail(email: string, includePassword: boolean = false): Promise<IUser | null> {
    const query = User.findOne({
      email: email.toLowerCase(),
      deleted: false,
      isActive: true
    });
    if (includePassword) {
      return await query.select('+password').exec();
    }
    return await query.exec();
  }

  /**
   * Find user by ID (only active and not deleted users)
   */
  async findById(id: string): Promise<IUser | null> {
    return await User.findOne({
      _id: id,
      deleted: false,
      isActive: true
    }).exec();
  }

  /**
   * Update user by ID (only active and not deleted users)
   */
  async updateById(
    id: string,
    updateData: {
      name?: string;
      email?: string;
      password?: string;
      role?: string[];
      permissions?: string[];
      refreshToken?: string;
      isActive?: boolean;
    }
  ): Promise<IUser | null> {
    return await User.findOneAndUpdate(
      {
        _id: id,
        deleted: false
      },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).exec();
  }

  /**
   * Find user by refresh token (only active and not deleted users)
   */
  async findByRefreshToken(refreshToken: string): Promise<IUser | null> {
    return await User.findOne({
      refreshToken,
      deleted: false,
      isActive: true
    })
      .select('+refreshToken')
      .exec();
  }

  /**
   * Update refresh token for user
   */
  async updateRefreshToken(userId: string, refreshToken: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      userId,
      { refreshToken },
      { new: true }
    ).exec();
  }

  /**
   * Clear refresh token for user
   */
  async clearRefreshToken(userId: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      userId,
      { $unset: { refreshToken: '' } },
      { new: true }
    ).exec();
  }

  /**
   * Soft delete user by ID
   * Sets deleted flag to true
   */
  async deleteById(id: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    ).exec();
  }

  /**
   * Restore soft-deleted user
   * Sets deleted flag to false
   */
  async restoreById(id: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      id,
      { deleted: false },
      { new: true }
    ).exec();
  }

  /**
   * Block user (set isActive to false)
   */
  async blockUser(id: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).exec();
  }

  /**
   * Unblock user (set isActive to true)
   */
  async unblockUser(id: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    ).exec();
  }

  /**
   * Hard delete user (permanently remove from database)
   * Use with caution - this cannot be undone
   */
  async hardDeleteById(id: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(id).exec();
  }

  /**
   * Check if email exists (only active and not deleted users)
   */
  async emailExists(email: string): Promise<boolean> {
    const user = await User.findOne({
      email: email.toLowerCase(),
      deleted: false,
      isActive: true
    }).exec();
    return !!user;
  }

  /**
   * Find user by reset token (only active and not deleted users)
   */
  async findByResetToken(resetToken: string): Promise<IUser | null> {
    return await User.findOne({
      resetToken,
      deleted: false,
      isActive: true,
      resetTokenExpiry: { $gt: new Date() }, // Token must not be expired
    })
      .select('+resetToken +resetTokenExpiry')
      .exec();
  }

  /**
   * Set password reset token for user
   */
  async setResetToken(
    userId: string,
    resetToken: string,
    resetTokenExpiry: Date
  ): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      userId,
      {
        resetToken,
        resetTokenExpiry,
      },
      { new: true }
    ).exec();
  }

  /**
   * Clear password reset token for user
   */
  async clearResetToken(userId: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      userId,
      {
        $unset: { resetToken: '', resetTokenExpiry: '' },
      },
      { new: true }
    ).exec();
  }
}

// Export a singleton instance
export const authDao = new AuthDao();

