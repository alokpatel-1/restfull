/**
 * Server Bootstrap
 * 
 * This file is the entry point of the application.
 * It initializes the Express app, connects to the database,
 * and starts the HTTP server. It handles graceful shutdown
 * and error handling during startup.
 */

import { createApp } from './app';
import { dbConfig } from './config/db.config';
import { envConfig } from './config/env.config';
import { logger } from './shared/utils/logger';

/**
 * Main function to start the server
 * Handles database connection and server startup
 */
async function startServer(): Promise<void> {
    try {
        // Create Express application
        const app = createApp();

        // Connect to database
        logger.info('Connecting to database...');
        await dbConfig.connect();

        // Start HTTP server
        const server = app.listen(envConfig.PORT, () => {
            logger.info(`Server is running on port ${envConfig.PORT}`);
            logger.info(`Environment: ${envConfig.NODE_ENV}`);
            logger.info(`API available at: http://localhost:${envConfig.PORT}/api`);
        });

        // Graceful shutdown handler
        const gracefulShutdown = async (signal: string): Promise<void> => {
            logger.info(`${signal} received. Starting graceful shutdown...`);

            // Stop accepting new connections
            server.close(async () => {
                logger.info('HTTP server closed');

                // Close database connection
                try {
                    await dbConfig.disconnect();
                    logger.info('Database connection closed');
                    process.exit(0);
                } catch (error) {
                    logger.error('Error during shutdown:', error);
                    process.exit(1);
                }
            });

            // Force close after 10 seconds
            setTimeout(() => {
                logger.error('Forced shutdown after timeout');
                process.exit(1);
            }, 10000);
        };

        // Listen for termination signals
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (reason: unknown) => {
            logger.error('Unhandled Promise Rejection:', reason);
            gracefulShutdown('unhandledRejection');
        });

        // Handle uncaught exceptions
        process.on('uncaughtException', (error: Error) => {
            logger.error('Uncaught Exception:', error);
            gracefulShutdown('uncaughtException');
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Start the server
startServer();

