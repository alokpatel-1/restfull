/**
 * Auth DTOs (Data Transfer Objects)
 * 
 * This file contains TypeScript interfaces and types for authentication data transfer.
 * Used for type safety when passing data between layers.
 */

/**
 * DTO for user registration
 */
export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

/**
 * DTO for user login
 */
export interface LoginDto {
  email: string;
  password: string;
}

/**
 * DTO for updating user profile
 */
export interface UpdateProfileDto {
  name?: string;
  email?: string;
  password?: string;
}

/**
 * DTO for user response (without sensitive data)
 */
export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  role: string[];
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO for authentication response
 */
export interface AuthResponseDto {
  user: UserResponseDto;
  token: string;
  refreshToken: string;
}

/**
 * DTO for refresh token request
 */
export interface RefreshTokenDto {
  refreshToken: string;
}

/**
 * DTO for refresh token response
 */
export interface RefreshTokenResponseDto {
  accessToken: string;
  refreshToken: string;
}

/**
 * DTO for forgot password request
 */
export interface ForgotPasswordDto {
  email: string;
}

/**
 * DTO for reset password request
 */
export interface ResetPasswordDto {
  token: string;
  password: string;
}

/**
 * DTO for change password request
 */
export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

