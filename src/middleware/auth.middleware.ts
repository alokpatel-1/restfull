/**
 * Authentication Middleware
 * 
 * This file contains middleware for JWT-based authentication.
 * It verifies JWT tokens and attaches user information to the request object.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { envConfig } from '../config/env.config';
import { responseUtil } from '../shared/utils/response.util';
import { authDao } from '../auth/dao/auth.dao';
import { Role, Permission } from '../shared/constants/permissions';

/**
 * Authentication middleware class
 * Handles JWT token verification and user authentication
 */
class AuthMiddleware {
  /**
   * Middleware to authenticate requests using JWT
   * Verifies the token and attaches user data to req.user
   */
  public authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Get token from cookies (preferred) or Authorization header (fallback)
      const token = req.cookies?.accessToken ||
        (req.headers.authorization?.startsWith('Bearer ')
          ? req.headers.authorization.substring(7)
          : null);

      if (!token) {
        responseUtil.unauthorized(
          res,
          'Authentication required. Please provide a valid token.'
        );
        return;
      }

      // Verify token
      let decoded: any;
      try {
        decoded = jwt.verify(token, envConfig.JWT_SECRET);
      } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
          responseUtil.unauthorized(res, 'Token has expired');
          return;
        }
        if (error.name === 'JsonWebTokenError') {
          responseUtil.unauthorized(res, 'Invalid token');
          return;
        }
        throw error;
      }

      // Get user from database to ensure they still exist
      const user = await authDao.findById(decoded.id);
      if (!user) {
        responseUtil.unauthorized(res, 'User not found');
        return;
      }

      // Attach user data to request object
      req.user = {
        id: user._id.toString(),
        email: user.email,
        role: user.role as Role,
        permissions: user.permissions as Permission[],
      };

      next();
    } catch (error) {
      responseUtil.unauthorized(res, 'Authentication failed');
    }
  };
}

// Export a singleton instance
export const authMiddleware = new AuthMiddleware();

