/**
 * Auth Model
 * 
 * This file contains the Mongoose schema and model for authentication.
 * Represents user data in the database.
 */

import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Interface for User document
 */
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: string[];
    permissions: string[];
    refreshToken?: string;
    resetToken?: string;
    resetTokenExpiry?: Date;
    isActive: boolean;
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * User schema definition
 */
const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, // Don't include password in queries by default
        },
        role: {
            type: [String],
            default: ['user'],
            enum: ['user', 'admin', 'moderator'],
        },
        permissions: {
            type: [String],
            default: [],
        },
        refreshToken: {
            type: String,
            select: false, // Don't include refresh token in queries by default
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true, // Index for faster queries
        },
        deleted: {
            type: Boolean,
            default: false,
            index: true, // Index for faster queries
        },
        resetToken: {
            type: String,
            select: false, // Don't include reset token in queries by default
        },
        resetTokenExpiry: {
            type: Date,
            select: false, // Don't include reset token expiry in queries by default
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Hash password before saving
 */
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

/**
 * Method to compare password
 */
userSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * User model
 */
const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;

