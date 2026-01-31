import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { errorMiddleware } from './middleware/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/user/user.routes';

/** Rate limit for auth endpoints: 10 requests per 15 min per IP */
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Creates and configures the Express application
 * @returns Configured Express application instance
 */
export function createApp(): Application {
  const app: Application = express();

  // Middleware: Parse JSON request bodies
  app.use(express.json());

  // Middleware: Parse URL-encoded request bodies
  app.use(express.urlencoded({ extended: true }));

  // Middleware: Parse cookies
  app.use(cookieParser());

  // Routes: Module routes (auth protected by rate limiter)
  app.use('/api/auth', authRateLimiter, authRoutes);
  app.use('/api/users', userRoutes);

  // Error handling: 404 handler (must be after all routes)
  app.use(errorMiddleware.handleNotFound.bind(errorMiddleware));

  // Error handling: Global error handler (must be last)
  app.use(errorMiddleware.handleError.bind(errorMiddleware));

  return app;
}
