/**
 * Database Configuration
 * 
 * This file handles MongoDB connection using Mongoose.
 * It provides a class-based approach to manage database connections
 * with proper error handling and connection lifecycle management.
 */

import mongoose, { Connection, Mongoose } from 'mongoose';
import { envConfig } from './env.config';
import { logger } from '../shared/utils/logger';
import { Permission } from '../shared/constants/permissions';

/**
 * Database configuration class
 * Manages MongoDB connection lifecycle
 */
class DatabaseConfig {
  private mongooseInstance: Mongoose | null = null;
  private connection: Connection | null = null;

  /**
   * Establishes connection to MongoDB
   * Uses connection pooling and handles connection events
   */
  public async connect(): Promise<void> {
    try {
      if (this.mongooseInstance) {
        logger.info('Database already connected');
        return;
      }

      const options = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      };

      this.mongooseInstance = await mongoose.connect(envConfig.MONGODB_URI, options);
      this.connection = this.mongooseInstance.connection;

      this.setupEventHandlers();

      logger.info(`MongoDB connected successfully to: ${envConfig.MONGODB_URI}`);
    } catch (error) {
      logger.error('MongoDB connection error:', error);
      throw error;
    }
  }

  /**
   * Closes the database connection
   * Gracefully handles disconnection
   */
  public async disconnect(): Promise<void> {
    try {
      if (this.mongooseInstance) {
        await this.mongooseInstance.disconnect();
        this.mongooseInstance = null;
        this.connection = null;
        logger.info('MongoDB disconnected successfully');
      }
    } catch (error) {
      logger.error('Error disconnecting from MongoDB:', error);
      throw error;
    }
  }

  /**
   * Sets up event handlers for database connection events
   * Handles connection, error, and disconnection events
   */
  private setupEventHandlers(): void {
    if (!this.connection) {
      return;
    }

    this.connection.on('connected', () => {
      logger.info('Mongoose connected to MongoDB');
    });

    this.connection.on('error', (error: Error) => {
      logger.error('Mongoose connection error:', error);
    });

    this.connection.on('disconnected', () => {
      logger.warn('Mongoose disconnected from MongoDB');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      await this.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await this.disconnect();
      process.exit(0);
    });
  }

  /**
   * Gets the current database connection
   * @returns The Mongoose connection instance
   */
  public getConnection(): Connection | null {
    return this.connection;
  }

  /**
   * Checks if the database is connected
   * @returns True if connected, false otherwise
   */
  public isConnected(): boolean {
    return this.connection?.readyState === 1;
  };
}

// Export a singleton instance
export const dbConfig = new DatabaseConfig();

