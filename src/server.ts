/**
 * Server Bootstrap
 * 
 * This file is the entry point of the application.
 * It initializes the Express app and starts the HTTP server.
 */

import { createApp } from './app';
import { dbConfig } from './config/db.config';
import { envConfig } from './config/env.config';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Main function to start the server
 */
async function startServer(): Promise<void> {
  try {
    // Connect to database
    console.log('Connecting to MongoDB...');
    await dbConfig.connect();

    // Create Express application
    const app = createApp();

    // Start HTTP server
    const server = app.listen(envConfig.PORT, () => {
      console.log(`Server is running on port ${envConfig.PORT}`);
      console.log(`Environment: ${envConfig.NODE_ENV}`);
      console.log(`API available at: http://localhost:${envConfig.PORT}/api`);
    });

    // Graceful shutdown handler
    const gracefulShutdown = async (signal: string): Promise<void> => {
      console.log(`${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        console.log('HTTP server closed');

        // Close database connection
        try {
          await dbConfig.disconnect();
          console.log('Database connection closed');
          process.exit(0);
        } catch (error) {
          console.error('Error during database disconnection:', error);
          process.exit(1);
        }
      });

      // Force close after 10 seconds
      setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: unknown) => {
      console.error('Unhandled Promise Rejection:', reason);
      gracefulShutdown('unhandledRejection');
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      console.error('Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();
