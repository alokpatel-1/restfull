/**
 * Express Application Setup
 * 
 * This file initializes and configures the Express application.
 * It sets up middleware, routes, and error handling.
 * This is the core application file that wires everything together.
 */

import express, { Application } from 'express';
import routes from './routes';
import { errorMiddleware } from './middleware/error.middleware';
import { logger } from './shared/utils/logger';
import cookieParser from 'cookie-parser';


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

  // Middleware: Request logging
  app.use((req, _res, next) => {
    logger.info(`${req.method} ${req.path}`, {
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
    next();
  });

  // Routes: Mount API routes
  app.use('/api', routes);

  // Error handling: 404 handler (must be after all routes)
  app.use(errorMiddleware.handleNotFound.bind(errorMiddleware));

  // Error handling: Global error handler (must be last)
  app.use(errorMiddleware.handleError.bind(errorMiddleware));

  return app;
}

