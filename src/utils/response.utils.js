/**
 * Standard API response utility functions
 */

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {Object} data - Response data
 * @returns {Object} JSON response
 */
export const sendSuccessResponse = (res, statusCode = 200, message = 'Success', data = null) => {
  const response = {
    success: true,
    status: statusCode,
    message,
    timestamp: new Date().toISOString()
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {Object} errors - Additional error details
 * @returns {Object} JSON response
 */
export const sendErrorResponse = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  const response = {
    success: false,
    status: statusCode,
    message,
    timestamp: new Date().toISOString()
  };

  if (errors !== null) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send validation error response
 * @param {Object} res - Express response object
 * @param {Array} errors - Validation errors array
 * @returns {Object} JSON response
 */
export const sendValidationErrorResponse = (res, errors) => {
  return sendErrorResponse(res, 400, 'Validation failed', errors);
};

/**
 * Send unauthorized response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @returns {Object} JSON response
 */
export const sendUnauthorizedResponse = (res, message = 'Unauthorized access') => {
  return sendErrorResponse(res, 401, message);
};

/**
 * Send forbidden response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @returns {Object} JSON response
 */
export const sendForbiddenResponse = (res, message = 'Forbidden access') => {
  return sendErrorResponse(res, 403, message);
};

/**
 * Send not found response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @returns {Object} JSON response
 */
export const sendNotFoundResponse = (res, message = 'Resource not found') => {
  return sendErrorResponse(res, 404, message);
};

/**
 * Send paginated response
 * @param {Object} res - Express response object
 * @param {Array} data - Response data
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items
 * @param {string} message - Success message
 * @returns {Object} JSON response
 */
export const sendPaginatedResponse = (res, data, page, limit, total, message = 'Success') => {
  const totalPages = Math.ceil(total / limit);
  
  return sendSuccessResponse(res, 200, message, {
    items: data,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  });
};


