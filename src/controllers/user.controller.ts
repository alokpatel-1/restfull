/**
 * User Controller
 * 
 * This file handles HTTP requests and responses for User endpoints.
 * The Controller layer is responsible for:
 * - Receiving HTTP requests
 * - Basic request validation
 * - Calling appropriate service methods
 * - Formatting and sending HTTP responses
 * 
 * NO business logic or database access should be in controllers.
 */

import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { responseUtil } from '../utils/response.util';
import { HTTP_STATUS } from '../constants/httpStatus';
import { CreateUserDto, UpdateUserDto, LoginUserDto } from '../dto/user.dto';
import { validationResult } from 'express-validator';

/**
 * User Controller class
 * Handles all HTTP requests related to users
 */
export class UserController {
  /**
   * Creates a new user
   * POST /api/users
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function for error handling
   */
  public async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Check for validation errors from express-validator
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        responseUtil.badRequest(
          res,
          'Validation failed',
          errors.array()
        );
        return;
      }

      const userData: CreateUserDto = req.body;
      const user = await userService.createUser(userData);

      responseUtil.created(res, 'User created successfully', user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Gets a user by ID
   * GET /api/users/:id
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function for error handling
   */
  public async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      // Basic validation
      if (!id) {
        responseUtil.badRequest(res, 'User ID is required');
        return;
      }

      const user = await userService.getUserById(id);
      responseUtil.success(
        res,
        HTTP_STATUS.OK,
        'User fetched successfully',
        user
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Gets all users (supports pagination via query params `page` and `limit`)
   * GET /api/users
   */
  public async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page = req.query.page ? parseInt(String(req.query.page), 10) : 1;
      const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 10;

      const result = await userService.getAllUsers(page, limit);

      responseUtil.success(
        res,
        HTTP_STATUS.OK,
        'Users fetched successfully',
        result
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Gets a user by email
   * GET /api/users/email/:email
   */
  public async getUserByEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.params;

      if (!email) {
        responseUtil.badRequest(res, 'Email is required');
        return;
      }

      const user = await userService.getUserByEmail(email);
      responseUtil.success(
        res,
        HTTP_STATUS.OK,
        'User fetched successfully',
        user
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates a user by ID
   * PUT /api/users/:id
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function for error handling
   */
  public async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        responseUtil.badRequest(res, 'Validation failed', errors.array());
        return;
      }

      const { id } = req.params;
      const updateData: UpdateUserDto = req.body;

      // Basic validation
      if (!id) {
        responseUtil.badRequest(res, 'User ID is required');
        return;
      }

      const user = await userService.updateUser(id, updateData);
      responseUtil.success(
        res,
        HTTP_STATUS.OK,
        'User updated successfully',
        user
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletes a user by ID
   * DELETE /api/users/:id
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function for error handling
   */
  public async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      // Basic validation
      if (!id) {
        responseUtil.badRequest(res, 'User ID is required');
        return;
      }

      await userService.deleteUser(id);
      responseUtil.success(
        res,
        HTTP_STATUS.OK,
        'User deleted successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Authenticates a user and returns JWT token
   * POST /api/users/login
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next function for error handling
   */
  public async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        responseUtil.badRequest(res, 'Validation failed', errors.array());
        return;
      }

      const loginData: LoginUserDto = req.body;
      const authResponse = await userService.login(loginData);

      responseUtil.success(
        res,
        HTTP_STATUS.OK,
        'Login successful',
        authResponse
      );
    } catch (error) {
      next(error);
    }
  }
}

