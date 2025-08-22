import Joi from 'joi';

/**
 * Joi validation schemas for user operations
 */
export const userSchemas = {
  /**
   * Schema for updating user information
   */
  updateUser: Joi.object({
    name: Joi.string().required().trim().min(2).max(100)
      .messages({
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 2 characters',
        'string.max': 'Name cannot exceed 100 characters',
        'any.required': 'Name is required'
      })
  }),

  /**
   * Schema for updating user password
   */
  updatePassword: Joi.object({
    currentPassword: Joi.string().required()
      .messages({
        'string.empty': 'Current password is required',
        'any.required': 'Current password is required'
      }),
    
    newPassword: Joi.string().required().min(6).max(30)
      .messages({
        'string.empty': 'New password is required',
        'string.min': 'New password must be at least 6 characters',
        'string.max': 'New password cannot exceed 30 characters',
        'any.required': 'New password is required'
      })
  }).custom((value, helpers) => {
    if (value.currentPassword === value.newPassword) {
      return helpers.error('password.same', { message: 'New password must be different from current password' });
    }
    return value;
  }),

  /**
   * Schema for updating user active status (block/unblock)
   */
  updateUserStatus: Joi.object({
    isActive: Joi.boolean().required()
      .messages({
        'any.required': 'Active status is required'
      })
  })
};
