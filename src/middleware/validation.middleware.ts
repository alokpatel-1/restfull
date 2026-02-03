/**
 * App-wide validation middleware using express-validator.
 * Use validateWith(validators) on any route to run validators and return 400 on errors.
 */

import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ValidationChain, validationResult } from 'express-validator';

/** Standard validation error item in 400 response. */
export interface ValidationErrorItem {
  field?: string;
  msg: string;
}

/** Standard 400 response when validation fails. */
export interface ValidationErrorResponse {
  success: false;
  message: string;
  errors: ValidationErrorItem[];
}

const defaultMessage = 'Validation failed';

/** Middleware that checks validation result and sends 400 if any validators failed. */
function checkValidationResult(req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const body: ValidationErrorResponse = {
      success: false,
      message: defaultMessage,
      errors: errors.array().map(
        (e): ValidationErrorItem => ({
          field: e.type === 'field' ? (String(e.path) || undefined) : undefined,
          msg: typeof e.msg === 'string' ? e.msg : String(e.msg),
        })
      ),
    };
    res.status(400).json(body);
    return;
  }
  next();
}

/**
 * Returns middleware that runs the given validators, then checks the result and sends 400 if invalid.
 * Use on any route: router.post('/path', ...validateWith([body('email').isEmail()]), handler)
 */
export function validateWith(validators: ValidationChain[]): RequestHandler[] {
  return [...validators, checkValidationResult];
}
