// HTTP Status Codes as an enum for better organization

export enum HttpStatus {
  // 2xx Success
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,

  // 4xx Client Errors
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  VALIDATION_ERROR = 422, // Alias for Unprocessable Entity

  // 5xx Server Errors
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

// Export as HTTP_STATUS for backward compatibility
export const HTTP_STATUS = HttpStatus;

