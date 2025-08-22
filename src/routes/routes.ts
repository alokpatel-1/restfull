import { Router } from 'express';
import { AuthRoutes } from './auth.routes';
import { UserRoutes } from './user.routes';
import { AdminRoutes } from './admin.routes';

/**
 * Main routes class that organizes all API routes
 */
export class Routes {
  public readonly router: Router;

  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Authentication routes
    this.router.use('/auth', new AuthRoutes().router);
    
    // User-specific routes
    this.router.use('/users', new UserRoutes().router);
    
    // Admin-specific routes
    this.router.use('/admin', new AdminRoutes().router);
  }
}
