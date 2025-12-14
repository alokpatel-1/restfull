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
export const PERMISSIONS: any = {
    // User permissions
    USERS_READ: 'users.read',
    USERS_CREATE: 'users.create',
    USERS_UPDATE: 'users.update',
    USERS_DELETE: 'users.delete',
    USERS_UPDATE_OWN: 'users.update.own', // Users can update their own profile
    USERS_DELETE_OWN: 'users.delete.own', // Users can delete their own account

    // Add more permissions as needed
    // ADMIN_ACCESS: 'admin.access',
    // CONTENT_MANAGE: 'content.manage',
} as const;

/**
 * Role definitions
 * Roles are stored in the user model.
 * Permissions are managed separately via the UserPermission model.
 */
export const ROLES = {
    USER: 'user',
    ADMIN: 'admin',
    MODERATOR: 'moderator',
} as const;

export const COMMON_CONSTANTS = {
    DEFAULT: 'default',
    ADMIN: 'admin',
    USER: 'user',
    EMPTY: 'empty'
}

export const BASIC_PERMISSIONS = [
    { name: 'user:create', description: 'Create user' },
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
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS] | string;

/**
 * Type for role values
 */
export type Role = typeof ROLES[keyof typeof ROLES];

