/**
 * Auth Validators
 *
 * Validation rules for authentication endpoints using express-validator.
 */

import { Request, Response, NextFunction } from 'express';
import { body, ValidationChain, validationResult } from 'express-validator';
import { AuthValidationErrorResponse, ValidationErrorItem } from './auth.types';

export const registerValidator: ValidationChain[] = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const loginValidator: ValidationChain[] = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const refreshTokenValidator: ValidationChain[] = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
];

export const forgotPasswordValidator: ValidationChain[] = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
];

export const resetPasswordValidator: ValidationChain[] = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];

/**
 * Middleware that returns 400 with validation errors if any validators failed.
 */
export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const body: AuthValidationErrorResponse = {
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(
        (e): ValidationErrorItem => ({
          field: e.type === 'field' ? (e.path as string) : undefined,
          msg: e.msg as string,
        })
      ),
    };
    res.status(400).json(body);
    return;
  }
  next();
};
