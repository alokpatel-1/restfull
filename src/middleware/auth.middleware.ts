import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { UserDao } from '../daos/user.dao';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export class AuthMiddleware {
  private userDao: UserDao;

  constructor() {
    this.userDao = new UserDao();
  }

  /**
   * Middleware to verify JWT token
   */
  verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get token from header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
      }

      // Extract token
      const token = authHeader.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, config.jwt.secret) as { id: string };
      
      // Find user
      const user = await this.userDao.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      // Attach user to request
      req.user = {
        id: user._id,
        email: user.email,
        name: user.name,
      };

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}