/**
 * Permission Validators
 * 
 * This file contains all validation rules for Permission endpoints.
 * Uses express-validator for request validation.
 */

import { body, param, query } from 'express-validator';

/**
 * Validation rules for creating a permission
 */
export const createPermissionValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Permission name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Permission name must be between 2 and 100 characters')
    .matches(/^[a-z0-9._-]+$/)
    .withMessage('Permission name can only contain lowercase letters, numbers, dots, underscores, and hyphens'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category cannot exceed 50 characters'),
];

/**
 * Validation rules for updating a permission
 */
export const updatePermissionValidation = [
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category cannot exceed 50 characters'),
];

/**
 * Validation rules for permission name parameter
 */
export const permissionNameValidation = [
  param('name')
    .trim()
    .notEmpty()
    .withMessage('Permission name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Permission name must be between 2 and 100 characters'),
];

/**
 * Validation rules for adding permission to user
 */
export const addUserPermissionValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('permissionName')
    .trim()
    .notEmpty()
    .withMessage('Permission name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Permission name must be between 2 and 100 characters'),
];

/**
 * Validation rules for removing permission from user
 */
export const removeUserPermissionValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('permissionName')
    .trim()
    .notEmpty()
    .withMessage('Permission name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Permission name must be between 2 and 100 characters'),
];

/**
 * Validation rules for user email parameter
 */
export const userEmailValidation = [
  param('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
];

/**
 * Validation rules for category query parameter
 */
export const categoryQueryValidation = [
  query('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category cannot exceed 50 characters'),
];

