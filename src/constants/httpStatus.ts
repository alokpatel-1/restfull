/**
 * HTTP Status Codes
 * 
 * This file contains HTTP status code constants for consistent use
 * across the application. Using constants instead of magic numbers
 * improves code readability and maintainability.
 */

export const HTTP_STATUS = {
  // Success responses
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,

  // Client error responses
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  VALIDATION_ERROR: 422,

  // Server error responses
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];

