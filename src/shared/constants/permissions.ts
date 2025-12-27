/**
 * Permissions Constants
 * 
 * This file defines permission name constants for use in the system.
 * Actual permissions are stored in the database and managed via API.
 * These constants serve as references for permission names.
 */

/**
 * Permission types for user management
 * These are the standard permission names used in the system.
 * Permissions are stored in the database and can be managed via API.
 */
export enum PERMISSIONS {
    // User permissions
    USERS_READ = 'user:read',
    USERS_CREATE = 'user:create',
    USERS_UPDATE = 'user:update',
    USERS_DELETE = 'user:delete',
    USERS_UPDATE_OWN = 'user:update:own', // Users can update their own profile
    USERS_DELETE_OWN = 'user:delete:own', // Users can delete their own account

    // Add more permissions as needed
    // ADMIN_ACCESS = 'admin.access',
    // CONTENT_MANAGE = 'content.manage',
}

/**
 * Role definitions
 * Roles are stored in the user model.
 * Permissions are managed separately via the UserPermission model.
 */
export enum ROLES {
    USER = 'user',
    ADMIN = 'admin',
    MODERATOR = 'moderator',
}

export const APP_CONSTANTS = {
    DEFAULT: 'default',
    ADMIN: 'admin',
    USER: 'user',
    EMPTY: 'empty',
    SYSTEM: 'system',
}

export const BASIC_PERMISSIONS = [
    { name: 'user:read', description: 'Read user details' },
    { name: 'user:update', description: 'Update user details' },
    { name: 'user:delete', description: 'Delete user' },
    { name: 'user:list', description: 'List users' },

    { name: 'profile:read', description: 'Read own profile' },
    { name: 'profile:update', description: 'Update own profile' }
];

/**
 * Type for permission values
 */
export type Permission = PERMISSIONS | string;

/**
 * Type for role values
 */
export type Role = ROLES;

