import { extractTokenFromHeader, verifyAccessToken } from '../utils/jwt.utils.js';
import userService from '../services/user.service.js';
import { sendUnauthorizedResponse, sendForbiddenResponse } from '../utils/response.utils.js';

/**
 * Authentication middleware to verify JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return sendUnauthorizedResponse(res, 'Access token is required');
    }

    // Verify token
    const decoded = verifyAccessToken(token);
    
    // Get user from database
    const user = await userService.findById(decoded.userId);
    
    if (!user) {
      return sendUnauthorizedResponse(res, 'User not found');
    }

    if (!user.is_active) {
      return sendUnauthorizedResponse(res, 'Account is deactivated');
    }

    // Add user to request object
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department,
      position: user.position
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return sendUnauthorizedResponse(res, 'Invalid token');
    }
    
    if (error.name === 'TokenExpiredError') {
      return sendUnauthorizedResponse(res, 'Token has expired');
    }

    console.error('Authentication error:', error);
    return sendUnauthorizedResponse(res, 'Authentication failed');
  }
};

/**
 * Authorization middleware to check user roles
 * @param {Array} allowedRoles - Array of allowed roles
 * @returns {Function} Middleware function
 */
export const authorizeRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendUnauthorizedResponse(res, 'Authentication required');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendForbiddenResponse(res, 'Insufficient permissions');
    }

    next();
  };
};

/**
 * Admin only middleware
 */
export const requireAdmin = authorizeRoles(['admin']);

/**
 * Manager and Admin middleware
 */
export const requireManager = authorizeRoles(['manager', 'admin']);

/**
 * User, Manager and Admin middleware (all authenticated users)
 */
export const requireUser = authorizeRoles(['user', 'manager', 'admin']);

/**
 * Optional authentication middleware (doesn't fail if no token)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return next();
    }

    const decoded = verifyAccessToken(token);
    const user = await userService.findById(decoded.userId);
    
    if (user && user.is_active) {
      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        position: user.position
      };
    }

    next();
  } catch (error) {
    // Ignore authentication errors for optional auth
    next();
  }
};

/**
 * Check if user owns the resource
 * @param {string} userIdField - Field name containing user ID in params/body
 * @returns {Function} Middleware function
 */
export const requireOwnership = (userIdField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return sendUnauthorizedResponse(res, 'Authentication required');
    }

    const resourceUserId = req.params[userIdField] || req.body[userIdField];
    
    if (!resourceUserId) {
      return sendForbiddenResponse(res, 'Resource user ID not found');
    }

    // Allow if user is admin or owns the resource
    if (req.user.role === 'admin' || req.user.id === resourceUserId) {
      return next();
    }

    return sendForbiddenResponse(res, 'Access denied: You can only access your own resources');
  };
};
