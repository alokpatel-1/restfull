/**
 * User Permission Model
 * 
 * This file defines the MongoDB schema for linking users to permissions.
 * It stores which permissions each user has.
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Interface representing a UserPermission document in MongoDB
 */
export interface IUserPermission extends Document {
    userEmail: string;
    permissionName: string;
    grantedBy?: string; // Email of admin who granted this permission
    createdAt: Date;
    updatedAt: Date;
}

/**
 * UserPermission schema definition
 */
const userPermissionSchema: Schema<IUserPermission> = new Schema(
    {
        userEmail: {
            type: String,
            required: [true, 'User email is required'],
            lowercase: true,
            trim: true,
            index: true,
        },
        permissionName: {
            type: String,
            required: [true, 'Permission name is required'],
            lowercase: true,
            trim: true,
            index: true,
        },
        grantedBy: {
            type: String,
            lowercase: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure unique user-permission pairs
userPermissionSchema.index({ userEmail: 1, permissionName: 1 }, { unique: true });

/**
 * UserPermission model
 */
export const UserPermissionModel: Model<IUserPermission> = mongoose.model<IUserPermission>(
    'UserPermission',
    userPermissionSchema
);

