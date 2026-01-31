/**
 * Error Middleware
 * 
 * Global error handling middleware
 */

import { Request, Response, NextFunction } from 'express';

export class ErrorMiddleware {
  /**
   * Handle 404 Not Found errors
   */
  handleNotFound(req: Request, res: Response, next: NextFunction): void {
    res.status(404).json({
      success: false,
      message: 'Route not found',
    });
  }

  /**
   * Handle global errors
   */
  handleError(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    console.error('Error:', err);

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { error: err.message }),
    });
  }
}

export const errorMiddleware = new ErrorMiddleware();
