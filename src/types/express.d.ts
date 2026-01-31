/**
 * Express Type Extensions
 * 
 * Extends Express Request/Response types if needed
 */

import { Request } from 'express';
import { IUser } from '../modules/user/user.model';

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}
