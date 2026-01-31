import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { envConfig } from '../config/env.config';
import { UserDao } from '../modules/user/user.dao';

export class AuthMiddleware {
    private userDao: UserDao;

    constructor() {
        this.userDao = new UserDao();
    }

    /**
     * Middleware to authenticate user and attach user details to request
     * Extracts user from JWT token and attaches to req.user
     */
    authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Get token from Authorization header
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                res.status(401).json({
                    success: false,
                    message: 'No token provided',
                });
                return;
            }

            const token = authHeader.substring(7); // Remove 'Bearer ' prefix

            // Verify token
            const decoded = jwt.verify(token, envConfig.JWT_SECRET) as { userId: string };

            // Find user by ID from token
            const user = await this.userDao.findUserById(decoded.userId);

            if (!user) {
                res.status(401).json({
                    success: false,
                    message: 'User not found',
                });
                return;
            }

            // Attach user to request object
            req.user = user;
            next();
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                res.status(401).json({
                    success: false,
                    message: 'Invalid token',
                });
                return;
            }

            if (error instanceof jwt.TokenExpiredError) {
                res.status(401).json({
                    success: false,
                    message: 'Token expired',
                });
                return;
            }

            next(error);
        }
    };

    /**
     * Optional middleware to attach user if token exists (doesn't fail if no token)
     * Useful for routes that work with or without authentication
     */
    optionalAuth = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
        try {
            const authHeader = req.headers.authorization;

            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.substring(7);
                try {
                    const decoded = jwt.verify(token, envConfig.JWT_SECRET) as { userId: string };
                    const user = await this.userDao.findUserById(decoded.userId);

                    if (user) {
                        req.user = user;
                    }
                } catch (error) {
                    // Ignore token errors for optional auth
                }
            }

            next();
        } catch (error) {
            // Ignore errors for optional auth
            next();
        }
    };
}

export const authMiddleware = new AuthMiddleware();
