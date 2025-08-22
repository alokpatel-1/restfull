import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/user.schema';

/**
 * Middleware to check if user has admin role
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Check if user exists and has admin role
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (req.user.role !== UserRole.ADMIN) {
    return res.status(403).json({ message: 'Access denied. Admin privileges required' });
  }

  next();
};

/**
 * Middleware to check if user has regular user role
 */
export const isUser = (req: Request, res: Response, next: NextFunction) => {
  // Check if user exists and has user role
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (req.user.role !== UserRole.USER) {
    return res.status(403).json({ message: 'Access denied. User privileges required' });
  }

  next();
};

/**
 * Middleware to check if user has either admin or user role
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  // Check if user exists
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  next();
};
