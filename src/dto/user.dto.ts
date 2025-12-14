/**
 * User DTO (Data Transfer Object)
 * 
 * This file contains TypeScript interfaces and types for User-related data.
 * DTOs define the shape of data that flows between layers (request/response).
 * They provide type safety and serve as contracts for data structures.
 */

/**
 * DTO for creating a new user
 * Used in request body validation
 */
export interface CreateUserDto {
    name: string;
    email: string;
    password: string;
}

/**
 * DTO for updating user information
 * All fields are optional as partial updates are allowed
 */
export interface UpdateUserDto {
    name?: string;
    email?: string;
    password?: string;
}

/**
 * DTO for user response
 * Excludes sensitive information like password
 * Used when sending user data in API responses
 */
export interface UserResponseDto {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * DTO for user login request
 */
export interface LoginUserDto {
    email: string;
    password: string;
}

/**
 * DTO for authentication response
 * Includes user data and JWT token
 */
export interface AuthResponseDto {
    user: UserResponseDto;
    token: string;
}

