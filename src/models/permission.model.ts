/**
 * Permission Model
 * 
 * This file defines the MongoDB schema for the Permission collection.
 * It stores all available permissions in the system.
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Interface representing a Permission document in MongoDB
 */
export interface IPermission extends Document {
    name: string;
    description?: string;
    category?: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Permission schema definition
 */
const permissionSchema: Schema<IPermission> = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Permission name is required'],
            unique: true,
            trim: true,
            lowercase: true,
        },
        description: {
            type: String,
            trim: true,
        },
        category: {
            type: String,
            trim: true,
            default: 'general',
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Permission model
 */
export const PermissionModel: Model<IPermission> = mongoose.model<IPermission>(
    'Permission',
    permissionSchema
);

