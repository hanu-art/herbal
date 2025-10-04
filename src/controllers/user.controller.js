import userService from '../services/user.service.js';
import { 
  sendSuccessResponse, 
  sendErrorResponse, 
  sendNotFoundResponse,
  sendPaginatedResponse 
} from '../utils/response.utils.js';

/**
 * Get all users (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page < 1 || limit < 1 || limit > 100) {
      return sendErrorResponse(res, 400, 'Invalid pagination parameters');
    }

    const result = await userService.findAll(page, limit);

    return sendPaginatedResponse(
      res, 
      result.users, 
      page, 
      limit, 
      result.total, 
      'Users retrieved successfully'
    );

  } catch (error) {
    console.error('Get all users error:', error);
    return sendErrorResponse(res, 500, 'Failed to retrieve users');
  }
};

/**
 * Get user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userService.findById(id);
    if (!user) {
      return sendNotFoundResponse(res, 'User not found');
    }

    return sendSuccessResponse(res, 200, 'User retrieved successfully', {
      user
    });

  } catch (error) {
    console.error('Get user by ID error:', error);
    return sendErrorResponse(res, 500, 'Failed to retrieve user');
  }
};

/**
 * Search users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const searchUsers = async (req, res) => {
  try {
    const { q: searchTerm, page = 1, limit = 10 } = req.query;

    if (!searchTerm || searchTerm.trim().length < 2) {
      return sendErrorResponse(res, 400, 'Search term must be at least 2 characters');
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      return sendErrorResponse(res, 400, 'Invalid pagination parameters');
    }

    const result = await userService.search(searchTerm.trim(), pageNum, limitNum);

    return sendPaginatedResponse(
      res, 
      result.users, 
      pageNum, 
      limitNum, 
      result.total, 
      'Search completed successfully'
    );

  } catch (error) {
    console.error('Search users error:', error);
    return sendErrorResponse(res, 500, 'Failed to search users');
  }
};

/**
 * Update user (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, role, department, position, is_active } = req.body;

    // Check if user exists
    const existingUser = await userService.findById(id);
    if (!existingUser) {
      return sendNotFoundResponse(res, 'User not found');
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (role) updateData.role = role;
    if (department !== undefined) updateData.department = department;
    if (position !== undefined) updateData.position = position;
    if (typeof is_active === 'boolean') updateData.is_active = is_active;

    const updatedUser = await userService.update(id, updateData);

    return sendSuccessResponse(res, 200, 'User updated successfully', {
      user: updatedUser
    });

  } catch (error) {
    console.error('Update user error:', error);
    return sendErrorResponse(res, 500, 'Failed to update user');
  }
};

/**
 * Deactivate user (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const existingUser = await userService.findById(id);
    if (!existingUser) {
      return sendNotFoundResponse(res, 'User not found');
    }

    // Prevent self-deactivation
    if (id === req.user.id) {
      return sendErrorResponse(res, 400, 'You cannot deactivate your own account');
    }

    await userService.deactivate(id);

    return sendSuccessResponse(res, 200, 'User deactivated successfully');

  } catch (error) {
    console.error('Deactivate user error:', error);
    return sendErrorResponse(res, 500, 'Failed to deactivate user');
  }
};


