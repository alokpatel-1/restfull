import { Router } from 'express';
import { AuthController } from './auth.controller';
import {
    registerValidator,
    loginValidator,
    refreshTokenValidator,
    forgotPasswordValidator,
    resetPasswordValidator,
    validate,
} from './auth.validator';

const router = Router();
const authController = new AuthController();

// POST /api/auth/register - Register a new user
router.post('/register', registerValidator, validate, authController.register);

// POST /api/auth/login - Login user
router.post('/login', loginValidator, validate, authController.login);

// POST /api/auth/refresh - Refresh access token
router.post('/refresh', refreshTokenValidator, validate, authController.refresh);

// POST /api/auth/logout - Logout user (revoke refresh token)
router.post('/logout', refreshTokenValidator, validate, authController.logout);

// GET or POST /api/auth/verify-email - Verify email (token in query or body)
router.get('/verify-email', authController.verifyEmail);
router.post('/verify-email', authController.verifyEmail);

// POST /api/auth/forgot-password - Request password reset email
router.post('/forgot-password', forgotPasswordValidator, validate, authController.forgotPassword);

// POST /api/auth/reset-password - Reset password with token
router.post('/reset-password', resetPasswordValidator, validate, authController.resetPassword);

export default router;
