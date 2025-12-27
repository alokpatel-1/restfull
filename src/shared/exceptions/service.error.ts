/**
 * Service Error
 * 
 * This file contains custom error classes for service layer errors.
 * These errors are used to handle business logic errors with appropriate HTTP status codes.
 */

/**
 * Custom error class for service errors
 * Used to throw errors from service layer with specific HTTP status codes
 */
export class ServiceError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.name = 'ServiceError';
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

