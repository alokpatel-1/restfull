import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { envConfig } from './config/env.config';
import { errorMiddleware } from './middleware/error.middleware';
import { registerRoutes } from './routes';

/**
 * Creates and configures the Express application
 * @returns Configured Express application instance
 */
export function createApp(): Application {
  const app: Application = express();

  // CORS: allow configured origin(s) with credentials (cookies)
  const corsOrigins = envConfig.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean);
  app.use(
    cors({
      origin: corsOrigins.length > 1 ? corsOrigins : corsOrigins[0] || 'http://localhost:4200',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Middleware: Parse JSON request bodies
  app.use(express.json());

  // Middleware: Parse URL-encoded request bodies
  app.use(express.urlencoded({ extended: true }));

  // Middleware: Parse cookies (for auth tokens)
  app.use(cookieParser());

  // Routes: all API routes registered in one place
  registerRoutes(app);

  // Error handling: 404 handler (must be after all routes)
  app.use(errorMiddleware.handleNotFound.bind(errorMiddleware));

  // Error handling: Global error handler (must be last)
  app.use(errorMiddleware.handleError.bind(errorMiddleware));

  return app;
}
