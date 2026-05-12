import { Application, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from '../modules/user/user.routes';
import inviteRoutes from '../modules/invite-user/invite-user.routes';

/** Rate limit for auth endpoints: 10 requests per 15 min per IP */
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Registers all API routes and their middleware on the Express app.
 */
export function registerRoutes(app: Application): void {
  /** Public health check (not rate-limited) — use to confirm Postman hits this API. */
  app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({ ok: true, name: 'restfull-api' });
  });

  app.use('/api/auth', authRateLimiter, authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/invite', inviteRoutes);
}
