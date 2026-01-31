/**
 * Database Configuration
 * 
 * Handles MongoDB connection and disconnection
 */

import mongoose from 'mongoose';
import { envConfig } from './env.config';

class DatabaseConfig {
    /**
     * Connect to MongoDB
     */
    async connect(): Promise<void> {
        try {
            await mongoose.connect(envConfig.MONGODB_URI);
            console.log('✅ MongoDB connected successfully');
        } catch (error) {
            console.error('❌ MongoDB connection error:', error);
            throw error;
        }
    }

    /**
     * Disconnect from MongoDB
     */
    async disconnect(): Promise<void> {
        try {
            await mongoose.disconnect();
            console.log('✅ MongoDB disconnected successfully');
        } catch (error) {
            console.error('❌ MongoDB disconnection error:', error);
            throw error;
        }
    }

    /**
     * Get connection status
     */
    isConnected(): boolean {
        return mongoose.connection.readyState === 1;
    }
}

export const dbConfig = new DatabaseConfig();
