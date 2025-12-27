/**
 * Auth Routes
 * 
 * This file defines all authentication-related API routes.
 * Handles routing and middleware setup for auth endpoints.
 */

import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  refreshTokenValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
} from '../validators/auth.validators';
import { authMiddleware } from '../../middleware/auth.middleware';

/**
 * Auth routes class
 * Sets up all authentication routes
 */
class AuthRoutes {
  readonly router: Router;

  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Public routes
    this.router.post(
      '/register',
      registerValidation,
      authController.register
    );

    this.router.post(
      '/login',
      loginValidation,
      authController.login
    );

    this.router.post(
      '/refresh',
      refreshTokenValidation,
      authController.refreshToken
    );

    this.router.post(
      '/forgot-password',
      forgotPasswordValidation,
      authController.forgotPassword
    );

    this.router.post(
      '/reset-password',
      resetPasswordValidation,
      authController.resetPassword
    );

    // Protected routes (require authentication)
    this.router.get(
      '/me',
      authMiddleware.authenticate,
      authController.getProfile
    );

    this.router.put(
      '/profile',
      authMiddleware.authenticate,
      updateProfileValidation,
      authController.updateProfile
    );

    this.router.delete(
      '/profile',
      authMiddleware.authenticate,
      authController.deleteProfile
    );

    this.router.post(
      '/logout',
      authMiddleware.authenticate,
      authController.logout
    );

    this.router.post(
      '/change-password',
      authMiddleware.authenticate,
      changePasswordValidation,
      authController.changePassword
    );
  }
}

const authRoutesInstance = new AuthRoutes();
export default authRoutesInstance.router;

