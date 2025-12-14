/**
 * Permission Routes
 * 
 * This file defines all routes related to Permission endpoints.
 * It maps HTTP methods and paths to controller methods.
 * Includes request validation using express-validator.
 */

import { Router } from 'express';
import AuthMiddleware from '../middleware/auth.middleware';
import { authorizationMiddleware } from '../middleware/authorization.middleware';
import { PERMISSIONS } from '../constants/permissions';
import {
    createPermissionValidation,
    updatePermissionValidation,
    permissionNameValidation,
    addUserPermissionValidation,
    removeUserPermissionValidation,
    userEmailValidation,
    categoryQueryValidation,
} from '../validators/permission.validators';
import PermissionController from '../controllers/permission.controller';

/**
 * Permission Routes Class
 * Handles all permission-related route definitions
 */
export class PermissionRoutes {
    readonly router: Router;
    private permissionController!: PermissionController;
    private authMiddleware!: AuthMiddleware

    constructor() {
        this.router = Router();
        this.permissionController = new PermissionController();
        this.authMiddleware = new AuthMiddleware();
        this.setupRoutes();
    }

    /**
     * Sets up all permission routes
     */
    private setupRoutes(): void {
        // POST /api/permissions - Create a new permission (admin only)
        this.router.post(
            '/',
            this.authMiddleware.authenticate,
            authorizationMiddleware.requirePermission(PERMISSIONS.USERS_CREATE),
            createPermissionValidation,
            this.permissionController.createPermission
        );

        // GET /api/permissions - Get all permissions
        this.router.get(
            '/',
            categoryQueryValidation,
            this.permissionController.getAllPermissions
        );

        // GET /api/permissions/:name - Get permission by name
        this.router.get(
            '/:name',
            permissionNameValidation,
            this.permissionController.getPermissionByName
        );

        // PUT /api/permissions/:name - Update permission (admin only)
        this.router.put(
            '/:name',
            this.authMiddleware.authenticate,
            authorizationMiddleware.requirePermission(PERMISSIONS.USERS_UPDATE),
            permissionNameValidation,
            updatePermissionValidation,
            this.permissionController.updatePermission
        );

        // DELETE /api/permissions/:name - Delete permission (admin only)
        this.router.delete(
            '/:name',
            this.authMiddleware.authenticate,
            authorizationMiddleware.requirePermission(PERMISSIONS.USERS_DELETE),
            permissionNameValidation,
            this.permissionController.deletePermission
        );

        // POST /api/permissions/users/add - Add permission to user (admin only)
        this.router.post(
            '/users/add',
            this.authMiddleware.authenticate,
            authorizationMiddleware.requirePermission(PERMISSIONS.USERS_UPDATE),
            addUserPermissionValidation,
            this.permissionController.addUserPermission
        );

        // POST /api/permissions/users/remove - Remove permission from user (admin only)
        this.router.post(
            '/users/remove',
            this.authMiddleware.authenticate,
            authorizationMiddleware.requirePermission(PERMISSIONS.USERS_UPDATE),
            removeUserPermissionValidation,
            this.permissionController.removeUserPermission
        );

        // GET /api/permissions/users/:email - Get all permissions for a user
        this.router.get(
            '/users/:email',
            userEmailValidation,
            this.permissionController.getUserPermissions
        );
    }
}

const permissionRoutesInstance = new PermissionRoutes();
export default permissionRoutesInstance.router;
