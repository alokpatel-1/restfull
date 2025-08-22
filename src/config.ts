import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/scraper',
  jwt: {
    secret: process.env.JWT_SECRET || 'default_jwt_secret_key_for_development',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
};
