import { Router, Request, Response } from 'express';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { isUser, isAuthenticated } from '../middleware/role.middleware';
import { UserController } from '../controllers/user.controller';
import { validateWithJoi } from '../middleware/validation.middleware';
import { userSchemas } from '../joi-validation/user.joi.schemas.validation';

/**
 * Routes specific to regular users
 */
export class UserRoutes {
  public readonly router: Router;
  private authMiddleware: AuthMiddleware;
  private userController: UserController;

  constructor() {
    this.router = Router();
    this.authMiddleware = new AuthMiddleware();
    this.userController = new UserController();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Get user dashboard - only accessible by regular users
    this.router.get(
      '/dashboard',
      this.authMiddleware.verifyToken,
      isUser,
      this.getUserDashboard
    );

    // Get user profile - accessible by any authenticated user
    this.router.get(
      '/profile',
      this.authMiddleware.verifyToken,
      isAuthenticated,
      this.userController.getProfile
    );

    // Update user profile - accessible by any authenticated user
    this.router.put(
      '/profile',
      this.authMiddleware.verifyToken,
      isAuthenticated,
      validateWithJoi(userSchemas.updateUser),
      this.userController.updateUser
    );

    // Update user password - accessible by any authenticated user
    this.router.put(
      '/password',
      this.authMiddleware.verifyToken,
      isAuthenticated,
      validateWithJoi(userSchemas.updatePassword),
      this.userController.updatePassword
    );

    // Example user-specific resource
    this.router.get(
      '/profile/settings',
      this.authMiddleware.verifyToken,
      isUser,
      this.getUserSettings
    );
  }

  /**
   * Get user dashboard
   */
  private getUserDashboard = (req: Request, res: Response): Response => {
    return res.status(200).json({
      message: 'User dashboard accessed successfully',
      user: req.user
    });
  };

  /**
   * Get user settings
   */
  private getUserSettings = (req: Request, res: Response): Response => {
    // In a real app, you would fetch user settings from the database
    return res.status(200).json({
      message: 'User settings retrieved successfully',
      settings: {
        notifications: true,
        theme: 'light',
        language: 'en'
      }
    });
  };
}