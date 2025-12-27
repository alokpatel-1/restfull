/**
 * Validation Utility
 * 
 * This file provides utility functions for formatting validation errors.
 * Converts express-validator error arrays into user-friendly formats.
 */

/**
 * Format validation errors into a cleaner structure
 * Groups errors by field and returns only the first error message per field
 * 
 * @param errors - Array of validation errors from express-validator
 * @returns Formatted errors object with field names as keys
 * 
 * @example
 * Input: [
 *   { type: 'field', path: 'name', msg: 'Name is required' },
 *   { type: 'field', path: 'name', msg: 'Name must be between 2 and 100 characters' },
 *   { type: 'field', path: 'email', msg: 'Email is required' }
 * ]
 * 
 * Output: {
 *   name: 'Name is required',
 *   email: 'Email is required'
 * }
 */
export function formatValidationErrors(
    errors: Array<{ path?: string; param?: string; msg: string;[key: string]: any }>
): Record<string, string> {
    const formattedErrors: Record<string, string> = {};

    errors.forEach((error) => {
        const field = (error.path || error.param || 'unknown') as string;
        const message = error.msg || 'Invalid value';

        // Only keep the first error message for each field
        if (!formattedErrors[field]) {
            formattedErrors[field] = message;
        }
    });

    return formattedErrors;
}

/**
 * Format validation errors into an array format with field and message
 * Useful when you need to preserve all error messages or need array format
 * 
 * @param errors - Array of validation errors from express-validator
 * @returns Array of formatted error objects
 * 
 * @example
 * Input: [
 *   { type: 'field', path: 'name', msg: 'Name is required' },
 *   { type: 'field', path: 'email', msg: 'Email is required' }
 * ]
 * 
 * Output: [
 *   { field: 'name', message: 'Name is required' },
 *   { field: 'email', message: 'Email is required' }
 * ]
 */
export function formatValidationErrorsArray(
    errors: Array<{ path?: string; param?: string; msg: string;[key: string]: any }>
): Array<{ field: string; message: string }> {
    const seenFields = new Set<string>();
    const formattedErrors: Array<{ field: string; message: string }> = [];

    errors.forEach((error) => {
        const field = (error.path || error.param || 'unknown') as string;
        const message = error.msg || 'Invalid value';

        // Only include the first error for each field
        if (!seenFields.has(field)) {
            seenFields.add(field);
            formattedErrors.push({
                field,
                message,
            });
        }
    });

    return formattedErrors;
}

