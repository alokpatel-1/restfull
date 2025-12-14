/**
 * User DAO (Data Access Object)
 * 
 * This file contains database access logic for User operations.
 * The DAO layer is the ONLY layer that communicates with the database.
 * It performs CRUD operations and returns data without any business logic.
 */

import { UserModel, IUser } from '../models/user.model';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';

/**
 * User DAO class
 * Handles all database operations for User entity
 */
class UserDao {
    /**
     * Creates a new user in the database
     * @param userData - User data to create
     * @returns Promise<IUser> - The created user document
     */
    public async create(userData: CreateUserDto): Promise<IUser> {
        const user = new UserModel(userData);
        return user.save();
    }

    /**
     * Finds a user by ID
     * @param id - User ID
     * @returns Promise<IUser | null> - The user document or null if not found
     */
    public async findById(id: string): Promise<IUser | null> {
        return UserModel.findOne({ _id: id, isDeleted: { $ne: true } }).select('-password').exec();
    }

    /**
     * Finds a user by email
     * @param email - User email
     * @param includePassword - Whether to include password in the result
     * @returns Promise<IUser | null> - The user document or null if not found
     */
    public async findByEmail(
        email: string,
        includePassword: boolean = false
    ): Promise<IUser | null> {
        const query = UserModel.findOne({ email, isDeleted: { $ne: true } });
        if (!includePassword) {
            query.select('-password');
        }
        return query.exec();
    }

    /**
     * Finds a user by email with password (for authentication)
     * @param email - User email
     * @returns Promise<IUser | null> - The user document with password or null if not found
     */
    public async findByEmailWithPassword(email: string): Promise<IUser | null> {
        return UserModel.findOne({ email, isDeleted: { $ne: true } }).select('+password').exec();
    }

    /**
     * Updates a user by ID
     * @param id - User ID
     * @param updateData - Data to update
     * @returns Promise<IUser | null> - The updated user document or null if not found
     */
    public async updateById(
        id: string,
        updateData: UpdateUserDto
    ): Promise<IUser | null> {
        return UserModel.findOneAndUpdate(
            { _id: id, isDeleted: { $ne: true } },
            { $set: updateData },
            { new: true, runValidators: true }
        )
            .select('-password')
            .exec();
    }

    /**
     * Deletes a user by ID
     * @param id - User ID
     * @returns Promise<IUser | null> - The deleted user document or null if not found
     */
    public async deleteById(id: string): Promise<IUser | null> {
        return UserModel.findOneAndUpdate(
            { _id: id, isDeleted: { $ne: true } },
            { $set: { isDeleted: true } },
            { new: true }
        ).select('-password').exec();
    }

    /**
     * Checks if a user with the given email exists
     * @param email - User email
     * @returns Promise<boolean> - True if user exists, false otherwise
     */
    public async existsByEmail(email: string): Promise<boolean> {
        const count = await UserModel.countDocuments({ email, isDeleted: { $ne: true } }).exec();
        return count > 0;
    }

    /**
     * Gets all users (with pagination support)
     * @param page - Page number (default: 1)
     * @param limit - Number of items per page (default: 10)
     * @returns Promise<{ users: IUser[]; total: number }> - Users and total count
     */
    public async findAll(
        page: number = 1,
        limit: number = 10
    ): Promise<{ users: IUser[]; total: number }> {
        const skip = (page - 1) * limit;
        const filter = { isDeleted: { $ne: true } };
        const [users, total] = await Promise.all([
            UserModel.find(filter).select('-password').skip(skip).limit(limit).exec(),
            UserModel.countDocuments(filter).exec(),
        ]);

        return { users, total };
    }
}

// Export a singleton instance
export const userDao = new UserDao();

