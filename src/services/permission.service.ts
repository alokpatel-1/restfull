/**
 * Permission Service
 * 
 * This file contains all business logic related to Permission operations.
 * The Service layer coordinates between Controllers and DAOs,
 * handles business rules, data transformations, and application-level logic.
 */

import { permissionDao } from '../dao/permission.dao';
import { userPermissionDao } from '../dao/user-permission.dao';
import { userDao } from '../dao/user.dao';
import {
    CreatePermissionDto,
    UpdatePermissionDto,
    PermissionResponseDto,
    AddUserPermissionDto,
    RemoveUserPermissionDto,
    UserPermissionsResponseDto,
} from '../dto/permission.dto';
import { IPermission } from '../models/permission.model';
import { logger } from '../utils/logger';
import { ServiceError } from './user.service';

/**
 * Permission Service class
 * Contains all business logic for permission operations
 */
class PermissionService {
    /**
     * Creates a new permission
     * @param permissionData - Permission data to create
     * @returns Promise<PermissionResponseDto> - The created permission
     * @throws ServiceError - If permission already exists
     */
    public async createPermission(
        permissionData: CreatePermissionDto
    ): Promise<PermissionResponseDto> {
        try {
            // Check if permission already exists
            const existingPermission = await permissionDao.findByName(permissionData.name);
            if (existingPermission) {
                throw new ServiceError('Permission already exists', 409);
            }

            const permission = await permissionDao.create(permissionData);
            return this.mapToPermissionResponseDto(permission);
        } catch (error) {
            if (error instanceof ServiceError) {
                throw error;
            }
            logger.error('Error creating permission:', error);
            throw new ServiceError('Failed to create permission', 500);
        }
    }

    /**
     * Gets all permissions
     * @param category - Optional category filter
     * @returns Promise<PermissionResponseDto[]> - Array of permissions
     */
    public async getAllPermissions(category?: string): Promise<PermissionResponseDto[]> {
        try {
            const permissions = await permissionDao.findAll(category);
            return permissions.map((p) => this.mapToPermissionResponseDto(p));
        } catch (error) {
            logger.error('Error fetching permissions:', error);
            throw new ServiceError('Failed to fetch permissions', 500);
        }
    }

    /**
     * Gets a permission by name
     * @param name - Permission name
     * @returns Promise<PermissionResponseDto> - The permission
     * @throws ServiceError - If permission not found
     */
    public async getPermissionByName(name: string): Promise<PermissionResponseDto> {
        try {
            const permission = await permissionDao.findByName(name);
            if (!permission) {
                throw new ServiceError('Permission not found', 404);
            }
            return this.mapToPermissionResponseDto(permission);
        } catch (error) {
            if (error instanceof ServiceError) {
                throw error;
            }
            logger.error('Error fetching permission:', error);
            throw new ServiceError('Failed to fetch permission', 500);
        }
    }

    /**
     * Updates a permission
     * @param name - Permission name
     * @param updateData - Data to update
     * @returns Promise<PermissionResponseDto> - The updated permission
     * @throws ServiceError - If permission not found
     */
    public async updatePermission(
        name: string,
        updateData: UpdatePermissionDto
    ): Promise<PermissionResponseDto> {
        try {
            const permission = await permissionDao.updateByName(name, updateData);
            if (!permission) {
                throw new ServiceError('Permission not found', 404);
            }
            return this.mapToPermissionResponseDto(permission);
        } catch (error) {
            if (error instanceof ServiceError) {
                throw error;
            }
            logger.error('Error updating permission:', error);
            throw new ServiceError('Failed to update permission', 500);
        }
    }

    /**
     * Deletes a permission
     * @param name - Permission name
     * @returns Promise<void>
     * @throws ServiceError - If permission not found
     */
    public async deletePermission(name: string): Promise<void> {
        try {
            const permission = await permissionDao.deleteByName(name);
            if (!permission) {
                throw new ServiceError('Permission not found', 404);
            }
            // Optionally remove all user permissions with this permission
            // await userPermissionDao.removeAllByPermission(name);
        } catch (error) {
            if (error instanceof ServiceError) {
                throw error;
            }
            logger.error('Error deleting permission:', error);
            throw new ServiceError('Failed to delete permission', 500);
        }
    }

    /**
     * Adds a permission to a user
     * @param data - User email and permission name
     * @param grantedBy - Email of admin who granted this permission
     * @returns Promise<UserPermissionsResponseDto> - Updated user permissions
     * @throws ServiceError - If user or permission not found
     */
    public async addUserPermission(
        data: AddUserPermissionDto,
        grantedBy?: string
    ): Promise<UserPermissionsResponseDto> {
        try {
            // Check if user exists
            const user = await userDao.findByEmail(data.email);
            if (!user) {
                throw new ServiceError('User not found', 404);
            }

            // Check if permission exists
            const permission = await permissionDao.findByName(data.permissionName);
            if (!permission) {
                throw new ServiceError('Permission not found', 404);
            }

            // Check if user already has this permission
            const hasPermission = await userPermissionDao.hasPermission(
                data.email,
                data.permissionName
            );
            if (hasPermission) {
                throw new ServiceError('User already has this permission', 409);
            }

            // Add permission to user
            await userPermissionDao.addPermission(data.email, data.permissionName, grantedBy);

            // Get updated permissions
            const permissions = await userPermissionDao.getPermissionsByEmail(data.email);

            return {
                email: data.email,
                permissions,
            };
        } catch (error) {
            if (error instanceof ServiceError) {
                throw error;
            }
            logger.error('Error adding user permission:', error);
            throw new ServiceError('Failed to add user permission', 500);
        }
    }

    /**
     * Removes a permission from a user
     * @param data - User email and permission name
     * @returns Promise<UserPermissionsResponseDto> - Updated user permissions
     * @throws ServiceError - If user or permission not found
     */
    public async removeUserPermission(
        data: RemoveUserPermissionDto
    ): Promise<UserPermissionsResponseDto> {
        try {
            // Check if user exists
            const user = await userDao.findByEmail(data.email);
            if (!user) {
                throw new ServiceError('User not found', 404);
            }

            // Remove permission from user
            const userPermission = await userPermissionDao.removePermission(
                data.email,
                data.permissionName
            );
            if (!userPermission) {
                throw new ServiceError('User does not have this permission', 404);
            }

            // Get updated permissions
            const permissions = await userPermissionDao.getPermissionsByEmail(data.email);

            return {
                email: data.email,
                permissions,
            };
        } catch (error) {
            if (error instanceof ServiceError) {
                throw error;
            }
            logger.error('Error removing user permission:', error);
            throw new ServiceError('Failed to remove user permission', 500);
        }
    }

    /**
     * Gets all permissions for a user
     * @param email - User email
     * @returns Promise<UserPermissionsResponseDto> - User permissions
     * @throws ServiceError - If user not found
     */
    public async getUserPermissions(email: string): Promise<UserPermissionsResponseDto> {
        try {
            // Check if user exists
            const user = await userDao.findByEmail(email);
            if (!user) {
                throw new ServiceError('User not found', 404);
            }

            const permissions = await userPermissionDao.getPermissionsByEmail(email);

            return {
                email,
                permissions,
            };
        } catch (error) {
            if (error instanceof ServiceError) {
                throw error;
            }
            logger.error('Error fetching user permissions:', error);
            throw new ServiceError('Failed to fetch user permissions', 500);
        }
    }

    /**
     * Maps IPermission document to PermissionResponseDto
     * @param permission - Permission document from database
     * @returns PermissionResponseDto - Permission response data
     */
    private mapToPermissionResponseDto(permission: IPermission): PermissionResponseDto {
        return {
            id: permission._id.toString(),
            name: permission.name,
            description: permission.description,
            category: permission.category,
            createdAt: permission.createdAt,
            updatedAt: permission.updatedAt,
        };
    }

    public async seedDefaultPermissions(permissions: any): Promise<void> {
        try {
            await permissionDao.seedDefaultPermissions(permissions);
            return;
        } catch (error) {
            throw new ServiceError('Failed to seed default permissions', 500);
        }
    }
}

// Export a singleton instance
export const permissionService = new PermissionService();

