import { body, query, ValidationChain } from 'express-validator';

/** Self-invitation: only email. No role, invitedBy, or shop in payload. */
export const selfInviteValidator: ValidationChain[] = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format'),
];

/** Seller/shop account invitation: email, role, shop. invitedBy set from req.user in controller. */
export const shopInviteValidator: ValidationChain[] = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format'),
    body('roleId').trim().notEmpty().withMessage('Role is required'),
    body('shopId').trim().notEmpty().withMessage('Shop is required'),
    body('name').optional({ values: 'null' }).trim(),
];

export const validateTokenQueryValidator: ValidationChain[] = [
    query('token').notEmpty().withMessage('Token is required'),
];

export const validateTokenBodyValidator: ValidationChain[] = [
    body('token').notEmpty().withMessage('Token is required'),
];

export const acceptInviteValidator: ValidationChain[] = [
    body('token').notEmpty().withMessage('Token is required'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    body('name').optional({ values: 'null' }).trim(),
];
