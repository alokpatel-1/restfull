/**
 * Express Type Definitions
 * 
 * This file extends Express types to add custom properties
 * to the Request object. This enables type-safe access to
 * custom properties added by middleware (e.g., user data from JWT).
 */

import { Request } from 'express';
import { Role, Permission } from '../constants/permissions';

declare global {
    namespace Express {
        interface Request {
            // User object added by authentication middleware
            user?: {
                id: string;
                email: string;
                role: Role;
                permissions: Permission[];
            };
        }
    }
}

