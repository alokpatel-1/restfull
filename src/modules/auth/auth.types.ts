import { IUser } from '../user/user.model';

/** Auth response/error codes used across auth service and controller. */
export enum AuthCode {
  // Register
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  REGISTRATION_SUCCESS = 'REGISTRATION_SUCCESS',
  REGISTRATION_FAILED = 'REGISTRATION_FAILED',

  // Login
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  ACCOUNT_INACTIVE = 'ACCOUNT_INACTIVE',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',

  // Verify email
  VERIFICATION_INVALID = 'VERIFICATION_INVALID',
  VERIFICATION_EXPIRED = 'VERIFICATION_EXPIRED',
  VERIFICATION_SUCCESS = 'VERIFICATION_SUCCESS',

  // Refresh token
  REFRESH_TOKEN_INVALID = 'REFRESH_TOKEN_INVALID',
  REFRESH_TOKEN_EXPIRED = 'REFRESH_TOKEN_EXPIRED',
  REFRESH_SUCCESS = 'REFRESH_SUCCESS',

  // Logout
  LOGOUT_SUCCESS = 'LOGOUT_SUCCESS',

  // Forgot password
  FORGOT_PASSWORD_SUCCESS = 'FORGOT_PASSWORD_SUCCESS',

  // Reset password
  RESET_PASSWORD_INVALID = 'RESET_PASSWORD_INVALID',
  RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS',
}

/** Base auth result: success, message, optional code. */
export interface AuthMessageResult {
  success: boolean;
  message: string;
  code?: AuthCode;
}

/** Access + refresh token pair. */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/** Role info returned in login / roles API. */
export interface RoleDetailResult {
  id: string;
  name: string;
}

/** Result of getRolesAndPermissions (auth DAO). */
export interface GetRolesAndPermissionsResult {
  roleDetails: RoleDetailResult[];
  permissions: string[];
}

/** Cookie options for auth cookies. */
export interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'none';
  maxAge: number;
  path: string;
}

/** User payload stored in cookie / returned in login data. */
export interface LoggedInUserData {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: RoleDetailResult[];
  permissions: string[];
}

/** Register API result. */
export interface RegisterResult extends AuthMessageResult {
  user?: IUser;
  accessToken?: string;
  refreshToken?: string;
}

/** Login API result. */
export interface LoginResult extends AuthMessageResult {
  user?: IUser;
  accessToken?: string;
  refreshToken?: string;
  roleDetails?: RoleDetailResult[];
  permissions?: string[];
}

/** Refresh token API result. */
export interface RefreshTokenResult extends AuthMessageResult {
  userId?: string;
}

/** Single validation error in 400 response. */
export interface ValidationErrorItem {
  field?: string;
  msg: string;
}

/** Validation failed response body. */
export interface AuthValidationErrorResponse {
  success: false;
  message: string;
  errors: ValidationErrorItem[];
}
