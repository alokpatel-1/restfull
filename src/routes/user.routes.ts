import { UserController } from './../controllers/user.controller';
/**
 * User Routes
 * 
 * This file defines all routes related to User endpoints.
 * It maps HTTP methods and paths to controller methods.
 * Includes request validation using express-validator.
 */

import { Router } from 'express';
import { authorizationMiddleware } from '../middleware/authorization.middleware';
import { PERMISSIONS } from '../constants/permissions';
import {
  createUserValidation,
  updateUserValidation,
  loginValidation,
  idValidation,
} from '../validators/user.validators';
import AuthMiddleware from '../middleware/auth.middleware';

/**
 * User Routes Class
 * Handles all user-related route definitions
 */
export class UserRoutes {
  readonly router: Router;
  readonly userController!: UserController;
  private authMiddleware!: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.authMiddleware = new AuthMiddleware();
    this.setupRoutes();
  }

  /**
   * Sets up all user routes
   */
  private setupRoutes(): void {
    this.router.post(
      '/register',
      createUserValidation,
      this.userController.createUser
    );

    // Get all users
    this.router.get(
      '/all',
      this.authMiddleware.authenticate,
      // authorizationMiddleware.requirePermission(PERMISSIONS.USERS_READ),
      this.userController.getAllUsers
    );

    this.router.post(
      '/login',
      loginValidation,
      this.userController.login
    );

    // Get user by email
    this.router.get(
      '/email/:email',
      this.authMiddleware.authenticate,
      // authorizationMiddleware.requirePermission(PERMISSIONS.USERS_READ),
      this.userController.getUserByEmail
    );

    // Get user by ID
    this.router.get(
      '/:id',
      idValidation,
      this.authMiddleware.authenticate,
      authorizationMiddleware.requireOwnershipOrPermission('id', PERMISSIONS.USERS_READ),
      this.userController.getUserById
    );

    // Update user by ID
    this.router.put(
      '/:id',
      idValidation,
      this.authMiddleware.authenticate,
      authorizationMiddleware.requireOwnershipOrPermission('id', PERMISSIONS.USERS_UPDATE),
      updateUserValidation,
      this.userController.updateUser
    );

    // Delete user by ID
    this.router.delete(
      '/delete/me',
      idValidation,
      this.authMiddleware.authenticate,
      this.userController.deleteUser
    );
  }
}

const userRoutesInstance = new UserRoutes();
export default userRoutesInstance.router;

