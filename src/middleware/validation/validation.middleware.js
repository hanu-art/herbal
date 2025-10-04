import { validationResult } from 'express-validator';
import { sendValidationErrorResponse } from '../../utils/response.utils.js';

/**
 * Validation middleware to check for validation errors
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    return sendValidationErrorResponse(res, formattedErrors);
  }
  
  next();
};

/**
 * Sanitize request body to prevent XSS
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const sanitizeInput = (req, res, next) => {
  const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        // Remove potential XSS patterns
        sanitized[key] = value
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '')
          .trim();
      } else {
        sanitized[key] = sanitizeObject(value);
      }
    }
    return sanitized;
  };
  
  // req.body is mutable, safe to reassign
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  // req.query is read-only in Express 5.x, use Object.assign to update in place
  if (req.query && Object.keys(req.query).length > 0) {
    const sanitizedQuery = sanitizeObject(req.query);
    Object.keys(req.query).forEach(key => delete req.query[key]);
    Object.assign(req.query, sanitizedQuery);
  }
  
  // req.params is read-only in Express 5.x, use Object.assign to update in place
  if (req.params && Object.keys(req.params).length > 0) {
    const sanitizedParams = sanitizeObject(req.params);
    Object.keys(req.params).forEach(key => delete req.params[key]);
    Object.assign(req.params, sanitizedParams);
  }
  
  next();
};


