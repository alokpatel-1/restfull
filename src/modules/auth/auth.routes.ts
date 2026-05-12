import { Router } from 'express';
import { validateWith } from '../../middleware/validation.middleware';
import { AuthController } from './auth.controller';
import {
    registerValidator,
    loginValidator,
    forgotPasswordValidator,
    resetPasswordValidator,
} from './auth.validator';

const router = Router();
const authController = new AuthController();

// POST /api/auth/register - Register a new user
router.post('/register', ...validateWith(registerValidator), authController.register);

// POST /api/auth/login - Login user
router.post('/login', ...validateWith(loginValidator), authController.login);

// POST /api/auth/refresh - Refresh access token (token in body or cookie)
router.post('/refresh', authController.refresh);

// POST /api/auth/logout - Logout user (token in body or cookie; clears cookies)
router.post('/logout', authController.logout);

// GET or POST /api/auth/verify-email - Verify email (token in query or body)
router.get('/verify-email', authController.verifyEmail);
router.post('/verify-email', authController.verifyEmail);

// GET /api/auth/verify-token - Verify auth token (token in query or header/cookie)
router.get('/verify-token', authController.verifyAuthToken);

// POST /api/auth/forgot-password - Request password reset email
router.post('/forgot-password', ...validateWith(forgotPasswordValidator), authController.forgotPassword);

// POST /api/auth/reset-password - Reset password with token
router.post('/reset-password', ...validateWith(resetPasswordValidator), authController.resetPassword);

export default router;
