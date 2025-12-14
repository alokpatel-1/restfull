/**
 * Permission Controller
 * 
 * This file contains controller methods for Permission endpoints.
 * Controllers handle HTTP requests and responses, delegate to services,
 * and format responses using response utilities.
 */

import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { permissionService } from '../services/permission.service';
import { responseUtil } from '../utils/response.util';
import { HTTP_STATUS } from '../constants/httpStatus';
import { APP_CONSTANTS } from '../constants/permissions';

/**
 * Permission Controller class
 * Handles HTTP requests for permission operations
 */
export default class PermissionController {
  /**
   * Creates a new permission
   * POST /api/permissions
   */
  public async createPermission(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        responseUtil.badRequest(res, 'Validation failed', errors.array());
        return;
      }

      const permission = await permissionService.createPermission(req.body);
      responseUtil.created(res, 'Permission created successfully', permission);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Gets all permissions
   * GET /api/permissions
   */
  public async getAllPermissions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const category = req.query.category as string || APP_CONSTANTS.DEFAULT;
      const permissions = await permissionService.getAllPermissions(category);
      responseUtil.success(res, HTTP_STATUS.OK, 'Permissions fetched successfully', permissions);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Gets a permission by name
   * GET /api/permissions/:name
   */
  public async getPermissionByName(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name } = req.params;
      const permission = await permissionService.getPermissionByName(name);
      responseUtil.success(res, HTTP_STATUS.OK, 'Permission fetched successfully', permission);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates a permission
   * PUT /api/permissions/:name
   */
  public async updatePermission(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        responseUtil.badRequest(res, 'Validation failed', errors.array());
        return;
      }

      const { name } = req.params;
      const permission = await permissionService.updatePermission(name, req.body);
      responseUtil.success(res, HTTP_STATUS.OK, 'Permission updated successfully', permission);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletes a permission
   * DELETE /api/permissions/:name
   */
  public async deletePermission(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name } = req.params;
      await permissionService.deletePermission(name);
      responseUtil.success(res, HTTP_STATUS.OK, 'Permission deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Adds a permission to a user
   * POST /api/permissions/users/add
   */
  public async addUserPermission(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        responseUtil.badRequest(res, 'Validation failed', errors.array());
        return;
      }

      const grantedBy = req.user?.email;
      const result = await permissionService.addUserPermission(req.body, grantedBy);
      responseUtil.success(
        res,
        HTTP_STATUS.OK,
        'Permission added to user successfully',
        result
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Removes a permission from a user
   * POST /api/permissions/users/remove
   */
  public async removeUserPermission(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        responseUtil.badRequest(res, 'Validation failed', errors.array());
        return;
      }

      const result = await permissionService.removeUserPermission(req.body);
      responseUtil.success(
        res,
        HTTP_STATUS.OK,
        'Permission removed from user successfully',
        result
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Gets all permissions for a user
   * GET /api/permissions/users/:email
   */
  public async getUserPermissions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.params;
      const result = await permissionService.getUserPermissions(email);
      responseUtil.success(res, HTTP_STATUS.OK, 'User permissions fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }
}


