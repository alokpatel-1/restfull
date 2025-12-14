/**
 * Response Utility
 * 
 * This file provides utility functions for formatting API responses.
 * It ensures consistent response structure across all endpoints,
 * making it easier for frontend clients to handle responses.
 */

import { Response } from 'express';
import { HTTP_STATUS, HttpStatus } from '../constants/httpStatus';

/**
 * Response utility class
 * Provides methods to send standardized API responses
 */
class ResponseUtil {
  /**
   * Sends a success response
   * @param res - Express response object
   * @param statusCode - HTTP status code
   * @param message - Success message
   * @param data - Optional data to include in response
   */
  public success(
    res: Response,
    statusCode: HttpStatus,
    message: string,
    data?: unknown
  ): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      ...(data && { data }),
    });
  }

  /**
   * Sends an error response
   * @param res - Express response object
   * @param statusCode - HTTP status code
   * @param message - Error message
   * @param errors - Optional array of validation errors
   */
  public error(
    res: Response,
    statusCode: HttpStatus,
    message: string,
    errors?: unknown
  ): Response {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(errors && typeof errors === 'object' ? { errors } : {}),
    });
  }

  /**
   * Sends a created response (201)
   * @param res - Express response object
   * @param message - Success message
   * @param data - Created resource data
   */
  public created(res: Response, message: string, data: unknown): Response {
    return this.success(res, HTTP_STATUS.CREATED, message, data);
  }

  /**
   * Sends a not found response (404)
   * @param res - Express response object
   * @param message - Error message
   */
  public notFound(res: Response, message: string): Response {
    return this.error(res, HTTP_STATUS.NOT_FOUND, message);
  }

  /**
   * Sends a bad request response (400)
   * @param res - Express response object
   * @param message - Error message
   * @param errors - Optional validation errors
   */
  public badRequest(res: Response, message: string, errors?: unknown): Response {
    return this.error(res, HTTP_STATUS.BAD_REQUEST, message, errors);
  }

  /**
   * Sends an unauthorized response (401)
   * @param res - Express response object
   * @param message - Error message
   */
  public unauthorized(res: Response, message: string): Response {
    return this.error(res, HTTP_STATUS.UNAUTHORIZED, message);
  }

  /**
   * Sends a forbidden response (403)
   * @param res - Express response object
   * @param message - Error message
   */
  public forbidden(res: Response, message: string): Response {
    return this.error(res, HTTP_STATUS.FORBIDDEN, message);
  }

  /**
   * Sends a conflict response (409)
   * @param res - Express response object
   * @param message - Error message
   */
  public conflict(res: Response, message: string): Response {
    return this.error(res, HTTP_STATUS.CONFLICT, message);
  }

  /**
   * Sends an internal server error response (500)
   * @param res - Express response object
   * @param message - Error message
   */
  public internalError(res: Response, message: string): Response {
    return this.error(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, message);
  }
}

// Export a singleton instance
export const responseUtil = new ResponseUtil();

