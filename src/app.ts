import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './middleware/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/user/user.routes';

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

  // Routes: Module routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);

  // Error handling: 404 handler (must be after all routes)
  app.use(errorMiddleware.handleNotFound.bind(errorMiddleware));

  // Error handling: Global error handler (must be last)
  app.use(errorMiddleware.handleError.bind(errorMiddleware));

  return app;
}
