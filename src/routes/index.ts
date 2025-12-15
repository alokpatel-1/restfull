/**
 * Route Aggregator
 * 
 * This file aggregates all route modules and mounts them
 * to the Express application. It serves as the central
 * point for route configuration.
 */

import { Router } from 'express';
import userRoutes from './user.routes';

const router = Router();

/**
 * Health check endpoint
 * Useful for monitoring and load balancers
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mount route modules
router.use('/users', userRoutes);

export default router;

