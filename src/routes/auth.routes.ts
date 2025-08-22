import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { validateWithJoi } from '../middleware/validation.middleware';
import { authSchemas } from '../joi-validation/auth.joi.schemas.validation';

/**
 * Routes for authentication (register, login, etc.)
 */
export class AuthRoutes {
  public readonly router: Router;
  private authController: AuthController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.authMiddleware = new AuthMiddleware();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Register regular user route
    this.router.post(
      '/register/user',
      validateWithJoi(authSchemas.registerUser),
      this.authController.registerUser
    );

    // Register admin route
    this.router.post(
      '/register/admin',
      validateWithJoi(authSchemas.registerAdmin),
      this.authController.registerAdmin
    );

    // Login route (common for both user types)
    this.router.post(
      '/login',
      validateWithJoi(authSchemas.login),
      this.authController.login
    );

    // Get user profile (protected route)
    this.router.get(
      '/profile',
      this.authMiddleware.verifyToken,
      this.authController.getProfile
    );
  }
}