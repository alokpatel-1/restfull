/**
 * Authentication Middleware
 * 
 * This file contains middleware for JWT authentication.
 * It verifies JWT tokens from request headers and attaches
 * user information to the request object for use in controllers.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { envConfig } from '../config/env.config';
import { responseUtil } from '../utils/response.util';
import { Role, Permission } from '../constants/permissions';
import { userPermissionDao } from '../dao/user-permission.dao';

/**
 * JWT payload interface
 */
interface JwtPayload {
    id: string;
    email: string;
    role: Role;
    iat?: number;
    exp?: number;
}

/**
 * Authentication middleware class
 * Handles JWT token verification
 */
export default class AuthMiddleware {
    /**
     * Middleware to verify JWT token
     * Extracts token from Authorization header, verifies it, and attaches user to request
     * @param req - Express request object
     * @param res - Express response object
     * @param next - Express next function
     */
    public async authenticate(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            // Extract token from Authorization header
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                responseUtil.unauthorized(
                    res,
                    'Authentication required. Please provide a valid token.'
                );
                return;
            }

            // Extract token (remove 'Bearer ' prefix)
            const token = authHeader.substring(7);

            if (!token) {
                responseUtil.unauthorized(res, 'Token is missing');
                return;
            }

            // Verify token
            const decoded = jwt.verify(token, envConfig.JWT_SECRET) as JwtPayload;

            // Get permissions from database for the user
            const permissionNames = await userPermissionDao.getPermissionsByEmail(decoded.email);
            const permissions: Permission[] = permissionNames as Permission[];

            // Attach user information to request object
            req.user = {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role,
                permissions,
            };

            next();
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                responseUtil.unauthorized(res, 'Invalid token');
                return;
            }

            if (error instanceof jwt.TokenExpiredError) {
                responseUtil.unauthorized(res, 'Token has expired');
                return;
            }

            // Pass error to error handler middleware
            next(error);
        }
    }

    /**
     * Optional authentication middleware
     * Attaches user to request if token is present, but doesn't fail if missing
     * Useful for endpoints that work both with and without authentication
     * @param req - Express request object
     * @param _res - Express response object (unused but required for middleware signature)
     * @param next - Express next function
     */
    public async optionalAuthenticate(
        req: Request,
        _res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const authHeader = req.headers.authorization;

            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.substring(7);
                const decoded = jwt.verify(token, envConfig.JWT_SECRET) as JwtPayload;

                // Get permissions from database for the user
                const permissionNames = await userPermissionDao.getPermissionsByEmail(decoded.email);
                const permissions: Permission[] = permissionNames as Permission[];

                req.user = {
                    id: decoded.id,
                    email: decoded.email,
                    role: decoded.role,
                    permissions,
                };
            }

            next();
        } catch (error) {
            // If token is invalid, just continue without user
            // This is optional auth, so we don't fail the request
            next();
        }
    }
}

