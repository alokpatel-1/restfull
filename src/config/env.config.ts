/**
 * Environment Configuration
 * 
 * This file handles loading and validating environment variables.
 * It provides a centralized way to access configuration values throughout the application.
 */

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Environment configuration class
 * Provides type-safe access to environment variables
 */
class EnvConfig {
  // Server configuration
  public readonly PORT: number;
  public readonly NODE_ENV: string;

  // Database configuration
  public readonly MONGODB_URI: string;

  // JWT configuration
  public readonly JWT_SECRET: string;
  public readonly JWT_EXPIRES_IN: string;
  public readonly JWT_REFRESH_SECRET: string;
  public readonly JWT_REFRESH_EXPIRES_IN: string;

  // Email configuration
  public readonly SMTP_HOST: string;
  public readonly SMTP_PORT: number;
  public readonly SMTP_SECURE: boolean;
  public readonly SMTP_USER: string;
  public readonly SMTP_PASS: string;
  public readonly EMAIL_FROM: string;
  public readonly EMAIL_FROM_NAME: string;
  public readonly APP_URL: string;

  // CORS configuration
  public readonly CORS_ORIGIN: string;

  constructor() {
    // Server configuration
    this.PORT = parseInt(process.env.PORT || '3000', 10);
    this.NODE_ENV = process.env.NODE_ENV || 'development';

    // Database configuration
    this.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/app_2026';

    // JWT configuration
    this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
    this.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production';
    this.JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

    // Email configuration
    this.SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
    this.SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
    this.SMTP_SECURE = process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465';
    this.SMTP_USER = process.env.SMTP_USER || '';
    this.SMTP_PASS = process.env.SMTP_PASS || '';
    this.EMAIL_FROM = process.env.EMAIL_FROM || process.env.SMTP_USER || 'noreply@example.com';
    this.EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || 'App 2026';
    this.APP_URL = process.env.APP_URL || 'http://localhost:3000/api';

    // CORS configuration
    this.CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:4200';
    // Validate required environment variables
    this.validate();
  }

  /**
   * Validates that all required environment variables are set
   * Throws an error if any required variable is missing
   */
  private validate(): void {
    const requiredVars: string[] = [];

    if (!this.MONGODB_URI) {
      requiredVars.push('MONGODB_URI');
    }

    if (this.NODE_ENV === 'production' && !this.JWT_SECRET) {
      requiredVars.push('JWT_SECRET');
    }
    if (this.NODE_ENV === 'production' && !this.JWT_REFRESH_SECRET) {
      requiredVars.push('JWT_REFRESH_SECRET');
    }

    if (requiredVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${requiredVars.join(', ')}`
      );
    }
  }

  /**
   * Checks if the application is running in production mode
   */
  public isProduction(): boolean {
    return this.NODE_ENV === 'production';
  }

  /**
   * Checks if the application is running in development mode
   */
  public isDevelopment(): boolean {
    return this.NODE_ENV === 'development';
  }
}

// Export a singleton instance
export const envConfig = new EnvConfig();

