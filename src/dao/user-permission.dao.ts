/**
 * User Permission DAO (Data Access Object)
 * 
 * This file contains database access logic for UserPermission operations.
 * The DAO layer is the ONLY layer that communicates with the database.
 */

import { logger } from '../utils/logger';
import { APP_CONSTANTS } from '../constants/permissions';
import { UserPermissionModel, IUserPermission } from '../models/user-permission.model';

/**
 * UserPermission DAO class
 * Handles all database operations for UserPermission entity
 */
class UserPermissionDao {
    /**
     * Gets all permissions for a user by email
     * @param userEmail - User email
     * @returns Promise<string[]> - Array of permission names
     */
    public async getPermissionsByEmail(userEmail: string): Promise<string[]> {
        const userPermissions = await UserPermissionModel.find({
            userEmail: userEmail.toLowerCase(),
        }).exec();

        return userPermissions.map((up) => up.permissionName);
    }

    /**
     * Adds a permission to a user
     * @param userEmail - User email
     * @param permissionName - Permission name
     * @param grantedBy - Email of admin who granted this permission
     * @returns Promise<IUserPermission> - The created user permission document
     */
    public async addPermission(
        userEmail: string,
        permissionName: string,
        grantedBy?: string
    ): Promise<IUserPermission> {
        const userPermission = new UserPermissionModel({
            userEmail: userEmail.toLowerCase(),
            permissionName: permissionName.toLowerCase(),
            grantedBy: grantedBy?.toLowerCase(),
        });
        return userPermission.save();
    }

    /**
     * Removes a permission from a user
     * @param userEmail - User email
     * @param permissionName - Permission name
     * @returns Promise<IUserPermission | null> - The deleted user permission or null if not found
     */
    public async removePermission(
        userEmail: string,
        permissionName: string
    ): Promise<IUserPermission | null> {
        return UserPermissionModel.findOneAndDelete({
            userEmail: userEmail.toLowerCase(),
            permissionName: permissionName.toLowerCase(),
        }).exec();
    }

    /**
     * Checks if a user has a specific permission
     * @param userEmail - User email
     * @param permissionName - Permission name
     * @returns Promise<boolean> - True if user has the permission, false otherwise
     */
    public async hasPermission(
        userEmail: string,
        permissionName: string
    ): Promise<boolean> {
        const count = await UserPermissionModel.countDocuments({
            userEmail: userEmail.toLowerCase(),
            permissionName: permissionName.toLowerCase(),
        }).exec();
        return count > 0;
    }

    /**
     * Gets all permissions for a user with details
     * @param userEmail - User email
     * @returns Promise<IUserPermission[]> - Array of user permission documents
     */
    public async getUserPermissions(userEmail: string): Promise<IUserPermission[]> {
        return UserPermissionModel.find({
            userEmail: userEmail.toLowerCase(),
        }).exec();
    }

    /**
     * Removes all permissions for a user
     * @param userEmail - User email
     * @returns Promise<number> - Number of deleted permissions
     */
    public async removeAllPermissions(userEmail: string): Promise<number> {
        const result = await UserPermissionModel.deleteMany({
            userEmail: userEmail.toLowerCase(),
        }).exec();
        return result.deletedCount || 0;
    }

    /**
     * Gets all users who have a specific permission
     * @param permissionName - Permission name
     * @returns Promise<string[]> - Array of user emails
     */
    public async getUsersWithPermission(permissionName: string): Promise<string[]> {
        const userPermissions = await UserPermissionModel.find({
            permissionName: permissionName.toLowerCase(),
        }).exec();

        return userPermissions.map((up) => up.userEmail);
    }

    public async bulkPermissionUpdateByEmail(
        userEmail: string,
        permissions: string[],
        grantedBy?: string
    ): Promise<void> {
        const bulkOps = permissions.map((permissionName) => ({
            updateOne: {
                filter: {
                    userEmail: userEmail.toLowerCase(),
                    permissionName: permissionName.toLowerCase(),
                },
                update: {
                    $setOnInsert: {
                        userEmail: userEmail.toLowerCase(),
                        permissionName: permissionName.toLowerCase(),
                        grantedBy: grantedBy?.toLowerCase() ?? APP_CONSTANTS.SYSTEM,
                    },
                },
                upsert: true,
            },
        }));

        if (bulkOps.length > 0) {
            await UserPermissionModel.bulkWrite(bulkOps);
        }
    }
}

// Export a singleton instance
export const userPermissionDao = new UserPermissionDao();

