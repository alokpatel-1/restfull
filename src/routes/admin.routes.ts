import { Router, Request, Response } from 'express';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/role.middleware';
import { AdminController } from '../controllers/admin.controller';
import { validateWithJoi } from '../middleware/validation.middleware';
import { userSchemas } from '../joi-validation/user.joi.schemas.validation';

/**
 * Routes specific to admin users
 */
export class AdminRoutes {
  public readonly router: Router;
  private authMiddleware: AuthMiddleware;
  private adminController: AdminController;

  constructor() {
    this.router = Router();
    this.authMiddleware = new AuthMiddleware();
    this.adminController = new AdminController();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Admin dashboard
    this.router.get(
      '/dashboard',
      this.authMiddleware.verifyToken,
      isAdmin,
      this.getAdminDashboard
    );

    // Get all users (admin only)
    this.router.get(
      '/users',
      this.authMiddleware.verifyToken,
      isAdmin,
      this.adminController.getAllUsers
    );

    // Get user by ID (admin only)
    this.router.get(
      '/users/:id',
      this.authMiddleware.verifyToken,
      isAdmin,
      this.adminController.getUserById
    );

    // Block/unblock user (admin only)
    this.router.put(
      '/users/:id/status',
      this.authMiddleware.verifyToken,
      isAdmin,
      validateWithJoi(userSchemas.updateUserStatus),
      this.adminController.updateUserStatus
    );

    // System settings (admin only)
    this.router.get(
      '/settings',
      this.authMiddleware.verifyToken,
      isAdmin,
      this.getSystemSettings
    );
  }

  /**
   * Get admin dashboard
   */
  private getAdminDashboard = (req: Request, res: Response): Response => {
    return res.status(200).json({
      message: 'Admin dashboard accessed successfully',
      admin: req.user
    });
  };

  /**
   * Get system settings (admin only)
   */
  private getSystemSettings = (req: Request, res: Response): Response => {
    return res.status(200).json({
      message: 'System settings retrieved successfully',
      settings: {
        maintenance: false,
        registrationEnabled: true,
        maxLoginAttempts: 5
      }
    });
  };
}