/**
 * Auth Controller
 * 
 * This file contains HTTP request handlers for authentication endpoints.
 * Handles request/response logic and delegates business logic to the service layer.
 */

import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { authService } from '../services/auth.service';
import { responseUtil } from '../../shared/utils/response.util';
import { HTTP_STATUS } from '../../shared/constants/httpStatus';
import { formatValidationErrors } from '../../shared/utils/validation.util';

/**
 * Auth controller class
 * Contains methods to handle authentication HTTP requests
 */
class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  public register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Check for validation errors
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        const formattedErrors = formatValidationErrors(validationErrors.array());
        responseUtil.error(
          res,
          HTTP_STATUS.VALIDATION_ERROR,
          'Validation failed',
          formattedErrors
        );
        return;
      }

      const { name, email, password } = req.body;
      const result = await authService.register({ name, email, password });

      // Set tokens in HTTP-only cookies
      this.setTokenCookies(res, result.token, result.refreshToken);

      // Remove tokens from response body for security
      const { token, refreshToken, ...responseData } = result;

      responseUtil.success(
        res,
        HTTP_STATUS.CREATED,
        'User registered successfully',
        responseData
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Login user
   * POST /api/auth/login
   */
  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Check for validation errors
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        const formattedErrors = formatValidationErrors(validationErrors.array());
        responseUtil.error(
          res,
          HTTP_STATUS.VALIDATION_ERROR,
          'Validation failed',
          formattedErrors
        );
        return;
      }

      const { email, password } = req.body;
      const result = await authService.login({ email, password });

      // Set tokens in HTTP-only cookies
      this.setTokenCookies(res, result.token, result.refreshToken);

      // Remove tokens from response body for security
      const { token, refreshToken, ...responseData } = result;

      responseUtil.success(
        res,
        HTTP_STATUS.OK,
        'Login successful',
        responseData
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get current user profile
   * GET /api/auth/me
   */
  public getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        responseUtil.unauthorized(res, 'Authentication required');
        return;
      }

      const user = await authService.getUserById(req.user.id);
      responseUtil.success(res, HTTP_STATUS.OK, 'Profile retrieved successfully', user);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update user profile
   * PUT /api/auth/profile
   */
  public updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Check for validation errors
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        const formattedErrors = formatValidationErrors(validationErrors.array());
        responseUtil.error(
          res,
          HTTP_STATUS.VALIDATION_ERROR,
          'Validation failed',
          formattedErrors
        );
        return;
      }

      if (!req.user) {
        responseUtil.unauthorized(res, 'Authentication required');
        return;
      }

      const user = await authService.updateProfile(req.user.id, req.body);
      responseUtil.success(res, HTTP_STATUS.OK, 'Profile updated successfully', user);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete user account
   * DELETE /api/auth/profile
   */
  public deleteProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        responseUtil.unauthorized(res, 'Authentication required');
        return;
      }

      await authService.deleteUser(req.user.id);
      responseUtil.success(res, HTTP_STATUS.OK, 'Account deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Refresh access token
   * POST /api/auth/refresh
   */
  public refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Get refresh token from cookies (preferred) or request body (fallback)
      const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

      if (!refreshToken) {
        responseUtil.error(
          res,
          HTTP_STATUS.VALIDATION_ERROR,
          'Refresh token is required'
        );
        return;
      }

      const result = await authService.refreshToken({ refreshToken });

      // Set new tokens in HTTP-only cookies
      this.setTokenCookies(res, result.accessToken, result.refreshToken);

      // Remove tokens from response body for security
      responseUtil.success(
        res,
        HTTP_STATUS.OK,
        'Token refreshed successfully'
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Logout user
   * POST /api/auth/logout
   */
  public logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        responseUtil.unauthorized(res, 'Authentication required');
        return;
      }

      await authService.logout(req.user.id);

      // Clear token cookies
      this.clearTokenCookies(res);

      responseUtil.success(res, HTTP_STATUS.OK, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Set token cookies (HTTP-only, secure)
   */
  private setTokenCookies(
    res: Response,
    accessToken: string,
    refreshToken: string
  ): void {
    const isProduction = process.env.NODE_ENV === 'production';

    // Cookie options: use 'lax' in development for cross-origin support,
    // 'strict' in production for better security
    const sameSite = isProduction ? 'strict' : 'lax';

    // Set access token cookie (15 minutes)
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction, // Only send over HTTPS in production
      sameSite: sameSite,
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
    });

    // Set refresh token cookie (7 days)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction, // Only send over HTTPS in production
      sameSite: sameSite,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });
  }

  /**
   * Clear token cookies
   */
  private clearTokenCookies(res: Response): void {
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
  }
}

// Export a singleton instance
export const authController = new AuthController();

