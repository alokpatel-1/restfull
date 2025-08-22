import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { validateWithJoi } from '../middleware/validation.middleware';
import { authSchemas } from '../joi-validation/auth.joi.schemas.validation';

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
    // Register route
    this.router.post(
      '/register',
      validateWithJoi(authSchemas.register),
      this.authController.register
    );

    // Login route
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