import Joi from 'joi';

/**
 * Joi validation schemas for authentication
 */
export const authSchemas = {
  /**
   * Schema for user registration
   */
  register: Joi.object({
    name: Joi.string().required().trim().min(2).max(100)
      .messages({
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 2 characters',
        'string.max': 'Name cannot exceed 100 characters',
        'any.required': 'Name is required'
      }),
    
    email: Joi.string().required().email()
      .messages({
        'string.empty': 'Email is required',
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    
    password: Joi.string().required().min(6).max(30)
      .messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters',
        'string.max': 'Password cannot exceed 30 characters',
        'any.required': 'Password is required'
      })
  }),

  /**
   * Schema for user login
   */
  login: Joi.object({
    email: Joi.string().required().email()
      .messages({
        'string.empty': 'Email is required',
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    
    password: Joi.string().required()
      .messages({
        'string.empty': 'Password is required',
        'any.required': 'Password is required'
      })
  })
};
