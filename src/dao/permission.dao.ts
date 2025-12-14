/**
 * Permission DAO (Data Access Object)
 * 
 * This file contains database access logic for Permission operations.
 * The DAO layer is the ONLY layer that communicates with the database.
 */

import { logger } from '../utils/logger';
import { PermissionModel, IPermission } from '../models/permission.model';

/**
 * Permission DAO class
 * Handles all database operations for Permission entity
 */
class PermissionDao {
    /**
     * Creates a new permission in the database
     * @param permissionData - Permission data to create
     * @returns Promise<IPermission> - The created permission document
     */
    public async create(permissionData: {
        name: string;
        description?: string;
        category?: string;
    }): Promise<IPermission> {
        const permission = new PermissionModel({
            ...permissionData,
            name: permissionData.name.toLowerCase(),
        });
        return permission.save();
    }

    /**
     * Finds a permission by name
     * @param name - Permission name
     * @returns Promise<IPermission | null> - The permission document or null if not found
     */
    public async findByName(name: string): Promise<IPermission | null> {
        return PermissionModel.findOne({ name: name.toLowerCase() }).exec();
    }

    /**
     * Finds a permission by ID
     * @param id - Permission ID
     * @returns Promise<IPermission | null> - The permission document or null if not found
     */
    public async findById(id: string): Promise<IPermission | null> {
        return PermissionModel.findById(id).exec();
    }

    /**
     * Gets all permissions
     * @param category - Optional category filter
     * @returns Promise<IPermission[]> - Array of permission documents
     */
    public async findAll(category?: string): Promise<IPermission[]> {
        const query = category
            ? PermissionModel.find({ category: category.toLowerCase() })
            : PermissionModel.find();
        return query.exec();
    }

    /**
     * Updates a permission by name
     * @param name - Permission name
     * @param updateData - Data to update
     * @returns Promise<IPermission | null> - The updated permission document or null if not found
     */
    public async updateByName(
        name: string,
        updateData: {
            description?: string;
            category?: string;
        }
    ): Promise<IPermission | null> {
        return PermissionModel.findOneAndUpdate(
            { name: name.toLowerCase() },
            { $set: updateData },
            { new: true, runValidators: true }
        ).exec();
    }

    /**
     * Deletes a permission by name
     * @param name - Permission name
     * @returns Promise<IPermission | null> - The deleted permission document or null if not found
     */
    public async deleteByName(name: string): Promise<IPermission | null> {
        return PermissionModel.findOneAndDelete({ name: name.toLowerCase() }).exec();
    }

    /**
     * Checks if a permission exists
     * @param name - Permission name
     * @returns Promise<boolean> - True if permission exists, false otherwise
     */
    public async exists(name: string): Promise<boolean> {
        const count = await PermissionModel.countDocuments({
            name: name.toLowerCase(),
        }).exec();
        return count > 0;
    };

    /**
 * Seeds default permissions into the database
 * @param permissions - Array of permission objects with name and description
 */
    public async seedDefaultPermissions(permissions: any[]): Promise<void> {
        const permissionDocs = permissions.map(p => ({
            ...p,
            category: 'default'
        }));
        for (const permission of permissionDocs) {
            await PermissionModel.updateOne(
                { name: permission.name },
                {
                    $setOnInsert: {
                        ...permission,
                        category: 'default'
                    }
                },
                { upsert: true }
            );
        }
    }
}

// Export a singleton instance
export const permissionDao = new PermissionDao();

