/**
 * User Model
 * 
 * This file defines the MongoDB schema for the User collection.
 * It represents the database structure and includes Mongoose schema definitions.
 * This layer is responsible only for database schema representation.
 */

import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLES, Role } from '../constants/permissions';

/**
 * Interface representing a User document in MongoDB
 * Extends Mongoose Document to include MongoDB-specific properties
 */
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: Role;
    isDeleted?: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * User schema definition
 * Defines the structure and validation rules for User documents
 */
const userSchema: Schema<IUser> = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters long'],
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email address',
            ],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters long'],
            select: false, // Don't include password in queries by default
        },
        role: {
            type: String,
            enum: Object.values(ROLES),
            default: ROLES.USER,
            required: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
            select: false,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

/**
 * Pre-save middleware to hash password before saving
 * Runs before a user document is saved to the database
 */
userSchema.pre<IUser>('save', async function (next: (err?: Error) => void) {
    // Only hash the password if it has been modified (or is new)
    const user = this as IUser & { isModified: (path: string) => boolean };
    if (!user.isModified('password')) {
        return next();
    }

    try {
        // Hash password with cost factor of 12
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

/**
 * Instance method to compare password with hashed password
 * Used during authentication to verify user credentials
 * @param candidatePassword - The plain text password to compare
 * @returns Promise<boolean> - True if passwords match, false otherwise
 */
userSchema.methods.comparePassword = async function (
    this: IUser,
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

/**
 * User model
 * Mongoose model for User collection
 */
export const UserModel: Model<IUser> = mongoose.model<IUser>('User', userSchema);

