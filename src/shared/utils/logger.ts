/**
 * Logger Utility
 * 
 * This file provides a centralized logging utility.
 * In production, this can be extended to use proper logging libraries
 * like Winston or Pino. For now, it provides a simple console-based logger
 * with different log levels.
 */

enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

/**
 * Logger class
 * Provides structured logging with different log levels
 */
class Logger {
  /**
   * Logs an info message
   * @param message - The message to log
   * @param data - Optional additional data to log
   */
  public info(message: string, data?: unknown): void {
    this.log(LogLevel.INFO, message, data);
  }

  /**
   * Logs a warning message
   * @param message - The warning message
   * @param data - Optional additional data to log
   */
  public warn(message: string, data?: unknown): void {
    this.log(LogLevel.WARN, message, data);
  }

  /**
   * Logs an error message
   * @param message - The error message
   * @param error - Optional error object or additional data
   */
  public error(message: string, error?: unknown): void {
    this.log(LogLevel.ERROR, message, error);
  }

  /**
   * Logs a debug message
   * @param message - The debug message
   * @param data - Optional additional data to log
   */
  public debug(message: string, data?: unknown): void {
    if (process.env.NODE_ENV === 'development') {
      this.log(LogLevel.DEBUG, message, data);
    }
  }

  /**
   * Internal method to format and output log messages
   * @param level - The log level
   * @param message - The message to log
   * @param data - Optional additional data
   */
  private log(level: LogLevel, message: string, data?: unknown): void {
    const timestamp = new Date().toISOString();
    const logEntry: {
      timestamp: string;
      level: LogLevel;
      message: string;
      data?: unknown;
    } = {
      timestamp,
      level,
      message,
    };
    if (data !== undefined && data !== null) {
      logEntry.data = data;
    }

    const logString = JSON.stringify(logEntry, null, 2);

    switch (level) {
      case LogLevel.ERROR:
        console.error(logString);
        break;
      case LogLevel.WARN:
        console.warn(logString);
        break;
      case LogLevel.DEBUG:
        console.debug(logString);
        break;
      default:
        console.log(logString);
    }
  }
}

// Export a singleton instance
export const logger = new Logger();

