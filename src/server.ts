import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { config } from './config';
import { Routes } from './routes/routes';

class Server {
  private app: Application;

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    // Parse JSON request body
    this.app.use(express.json());
    
    // Parse URL-encoded request body
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setupRoutes(): void {
    // Health check route
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({ status: 'ok' });
    });

    // API routes - using the main routes file
    this.app.use('/api', new Routes().router);

    // 404 route
    this.app.use('*', (req: Request, res: Response) => {
      res.status(404).json({ message: 'Route not found' });
    });
  }

  private setupErrorHandling(): void {
    // Global error handler
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error('Unhandled error:', err);
      res.status(500).json({
        message: 'Internal server error',
        error: config.nodeEnv === 'development' ? err.message : undefined,
      });
    });
  }

  public async start(): Promise<void> {
    try {
      // Connect to MongoDB
      await mongoose.connect(config.mongodbUri);
      console.log('Connected to MongoDB');

      // Start server
      this.app.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`);
        console.log(`Role-based authentication API is ready!`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }
}

// Start server
const server = new Server();
server.start().catch(console.error);