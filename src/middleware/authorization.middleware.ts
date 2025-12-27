/**
 * Authorization Middleware
 * 
 * This file contains middleware for role and permission-based authorization.
 * It checks if authenticated users have the required permissions to access resources.
 * Must be used after authentication middleware.
 */

import { Request, Response, NextFunction } from 'express';
import { responseUtil } from '../shared/utils/response.util';
import { Permission, PERMISSIONS, ROLES } from '../shared/constants/permissions';

/**
 * Authorization middleware class
 * Handles permission and role-based access control
 */
class AuthorizationMiddleware {
  /**
   * Middleware to check if user has required permission(s)
   * Must be used after authentication middleware
   * @param requiredPermissions - Single permission or array of permissions (user needs at least one)
   * @returns Express middleware function
   */
  public requirePermission(
    requiredPermissions: Permission | Permission[]
  ) {
    return (req: Request, res: Response, next: NextFunction): void => {
      // Ensure user is authenticated (should be set by auth middleware)
      if (!req.user) {
        responseUtil.unauthorized(
          res,
          'Authentication required. Please provide a valid token.'
        );
        return;
      }

      const userPermissions = req.user.permissions || [];
      const permissionsArray = Array.isArray(requiredPermissions)
        ? requiredPermissions
        : [requiredPermissions];

      // Check if user has at least one of the required permissions
      const hasPermission = permissionsArray.some((permission) =>
        userPermissions.includes(permission)
      );

      if (!hasPermission) {
        responseUtil.forbidden(
          res,
          'You do not have permission to perform this action.'
        );
        return;
      }

      next();
    };
  }

  /**
   * Middleware to check if user has required role(s)
   * Must be used after authentication middleware
   * @param requiredRoles - Single role or array of roles (user needs at least one)
   * @returns Express middleware function
   */
  public requireRole(requiredRoles: string | string[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
      // Ensure user is authenticated
      if (!req.user) {
        responseUtil.unauthorized(
          res,
          'Authentication required. Please provide a valid token.'
        );
        return;
      }

      const userRole = req.user.role;
      const rolesArray = Array.isArray(requiredRoles)
        ? requiredRoles
        : [requiredRoles];

      // Check if user has at least one of the required roles
      const hasRole = rolesArray.includes(userRole);

      if (!hasRole) {
        responseUtil.forbidden(
          res,
          'You do not have the required role to perform this action.'
        );
        return;
      }

      next();
    };
  }

  /**
   * Middleware to check if user is the owner of the resource or has admin permission
   * Useful for operations like updating/deleting own profile
   * Must be used after authentication middleware
   * @param resourceIdParam - Name of the route parameter containing the resource ID (default: 'id')
   * @param requiredPermission - Permission required if user is not the owner (default: admin permission)
   * @returns Express middleware function
   */
  public requireOwnershipOrPermission(
    resourceIdParam: string = 'id',
    requiredPermission?: Permission
  ) {
    return (req: Request, res: Response, next: NextFunction): void => {
      // Ensure user is authenticated
      if (!req.user) {
        responseUtil.unauthorized(
          res,
          'Authentication required. Please provide a valid token.'
        );
        return;
      }

      const userId = req.user.id;
      const resourceId = req.params[resourceIdParam];

      // If user is the owner, allow access
      if (userId === resourceId) {
        return next();
      }

      // If not owner, check for required permission
      const userPermissions = req.user.permissions || [];
      const permissionToCheck =
        requiredPermission || (PERMISSIONS[ROLES.ADMIN]?.[0] as Permission);

      if (permissionToCheck && userPermissions.includes(permissionToCheck)) {
        return next();
      }

      // User is not owner and doesn't have required permission
      responseUtil.forbidden(
        res,
        'You do not have permission to perform this action on this resource.'
      );
    };
  }
}

// Export a singleton instance
export const authorizationMiddleware = new AuthorizationMiddleware();

