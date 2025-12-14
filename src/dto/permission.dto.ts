/**
 * Permission DTOs (Data Transfer Objects)
 * 
 * This file defines data transfer objects for Permission operations.
 * DTOs are used to structure data for API requests and responses.
 */

/**
 * DTO for creating a permission
 */
export interface CreatePermissionDto {
    name: string;
    description?: string;
    category?: string;
}

/**
 * DTO for updating a permission
 */
export interface UpdatePermissionDto {
    description?: string;
    category?: string;
}

/**
 * DTO for permission response
 */
export interface PermissionResponseDto {
    id: string;
    name: string;
    description?: string;
    category?: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * DTO for adding permission to user
 */
export interface AddUserPermissionDto {
    email: string;
    permissionName: string;
}

/**
 * DTO for removing permission from user
 */
export interface RemoveUserPermissionDto {
    email: string;
    permissionName: string;
}

/**
 * DTO for user permissions response
 */
export interface UserPermissionsResponseDto {
    email: string;
    permissions: string[];
}

