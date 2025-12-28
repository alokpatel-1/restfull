/**
 * Express Application Setup
 * 
 * This file initializes and configures the Express application.
 * It sets up middleware, routes, and error handling.
 * This is the core application file that wires everything together.
 */

import express, { Application } from 'express';
import cors from 'cors';
import routes from './routes';
import { errorMiddleware } from './middleware/error.middleware';
import { logger } from './shared/utils/logger';
import cookieParser from 'cookie-parser';
import { envConfig } from './config/env.config';


/**
 * Creates and configures the Express application
 * @returns Configured Express application instance
 */
export function createApp(): Application {
  const app: Application = express();

  // Middleware: CORS configuration
  const corsOptions: cors.CorsOptions = {
    origin: envConfig.CORS_ORIGIN === '*' 
      ? true // Allow all origins (not recommended for production)
      : envConfig.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type'],
  };
  app.use(cors(corsOptions));

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

