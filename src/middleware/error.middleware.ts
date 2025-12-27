/**
 * Error Handling Middleware
 * 
 * This file contains centralized error handling middleware.
 * It catches all errors thrown in the application and formats
 * them into consistent error responses. This ensures proper
 * error handling across all routes.
 */

import { Request, Response, NextFunction } from 'express';
import { ServiceError } from '../shared/exceptions/service.error';
import { responseUtil } from '../shared/utils/response.util';
import { HTTP_STATUS } from '../shared/constants/httpStatus';
import { logger } from '../shared/utils/logger';
import { ValidationError } from 'mongoose';

/**
 * Error handling middleware class
 * Centralized error handling for the application
 */
class ErrorMiddleware {
  /**
   * Main error handling middleware
   * Catches all errors and formats them into appropriate responses
   * @param err - The error object
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function
   */
  public handleError(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    // Log the error for debugging
    logger.error('Error occurred:', {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });

    // Handle ServiceError (business logic errors)
    if (err instanceof ServiceError) {
      responseUtil.error(res, err.statusCode as HTTP_STATUS, err.message);
      return;
    }

    // Handle Mongoose validation errors
    if (err instanceof ValidationError) {
      const errors = Object.values(err.errors).map((e) => ({
        field: e.path,
        message: e.message,
      }));
      responseUtil.error(
        res,
        HTTP_STATUS.VALIDATION_ERROR,
        'Validation failed',
        errors
      );
      return;
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
      responseUtil.unauthorized(res, 'Invalid token');
      return;
    }

    if (err.name === 'TokenExpiredError') {
      responseUtil.unauthorized(res, 'Token has expired');
      return;
    }

    // Handle duplicate key errors (MongoDB)
    if ((err as Error & { code?: number }).code === 11000) {
      responseUtil.conflict(res, 'Duplicate entry. Resource already exists.');
      return;
    }

    // Handle cast errors (invalid MongoDB ObjectId)
    if (err.name === 'CastError') {
      responseUtil.badRequest(res, 'Invalid ID format');
      return;
    }

    // Default error handler (500 Internal Server Error)
    responseUtil.internalError(
      res,
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message
    );
  }

  /**
   * 404 Not Found handler
   * Handles requests to non-existent routes
   * @param req - Express request object
   * @param res - Express response object
   */
  public handleNotFound(req: Request, res: Response): void {
    responseUtil.notFound(res, `Route ${req.method} ${req.path} not found`);
  }
}

// Export a singleton instance
export const errorMiddleware = new ErrorMiddleware();

