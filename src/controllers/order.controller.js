/**
 * Order Controller - Request handlers for order endpoints
 * Handles HTTP requests and responses for order operations
 */

import orderService from '../services/order.service.js';
import {
  sendSuccessResponse,
  sendErrorResponse,
  sendPaginatedResponse,
  sendNotFoundResponse
} from '../utils/response.utils.js';

/**
 * Get all orders with pagination (Admin only)
 * @route GET /api/orders/all
 * @access Admin only
 */
export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page < 1 || limit < 1 || limit > 100) {
      return sendErrorResponse(res, 400, 'Invalid pagination parameters');
    }

    const result = await orderService.findAll(page, limit);
    
    return sendPaginatedResponse(
      res,
      result.orders,
      page,
      limit,
      result.total,
      'Orders retrieved successfully'
    );
  } catch (err) {
    console.error('Error in getAllOrders controller:', err);
    return sendErrorResponse(res, 500, 'Failed to fetch orders', { error: err.message });
  }
};

/**
 * Get current user's orders with pagination
 * @route GET /api/orders
 * @access Authenticated users
 */
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page < 1 || limit < 1 || limit > 100) {
      return sendErrorResponse(res, 400, 'Invalid pagination parameters');
    }

    const result = await orderService.findByUser(userId, page, limit);
    
    return sendPaginatedResponse(
      res,
      result.orders,
      page,
      limit,
      result.total,
      'Orders retrieved successfully'
    );
  } catch (err) {
    console.error('Error in getUserOrders controller:', err);
    return sendErrorResponse(res, 500, 'Failed to fetch orders', { error: err.message });
  }
};

/**
 * Get single order by ID
 * @route GET /api/orders/:id
 * @access Authenticated users (own orders) or Admin
 */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!id) {
      return sendErrorResponse(res, 400, 'Order ID is required');
    }

    const order = await orderService.findById(id);
    
    if (!order) {
      return sendNotFoundResponse(res, 'Order not found');
    }

    // Check if user owns the order or is admin
    if (userRole !== 'admin' && order.user_id !== userId) {
      return sendErrorResponse(res, 403, 'Access denied');
    }

    return sendSuccessResponse(res, 200, 'Order retrieved successfully', { order });
  } catch (err) {
    console.error('Error in getOrderById controller:', err);
    return sendErrorResponse(res, 500, 'Failed to fetch order', { error: err.message });
  }
};

/**
 * Create new order
 * @route POST /api/orders
 * @access Authenticated users
 */
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const { items, status } = req.body;

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return sendErrorResponse(res, 400, 'Order must have at least one item');
    }

    // Validate each item
    for (const item of items) {
      if (!item.product_id || !item.quantity || !item.price) {
        return sendErrorResponse(
          res,
          400,
          'Each item must have product_id, quantity, and price'
        );
      }

      if (isNaN(item.quantity) || parseInt(item.quantity) < 1) {
        return sendErrorResponse(res, 400, 'Invalid quantity value');
      }

      if (isNaN(item.price) || parseFloat(item.price) < 0) {
        return sendErrorResponse(res, 400, 'Invalid price value');
      }
    }

    const orderData = {
      user_id: userId,
      items,
      status: status || 'pending'
    };

    const order = await orderService.create(orderData);
    
    return sendSuccessResponse(res, 201, 'Order created successfully', { order });
  } catch (err) {
    console.error('Error in createOrder controller:', err);
    
    if (err.message.includes('required') || err.message.includes('must have')) {
      return sendErrorResponse(res, 400, err.message);
    }
    
    return sendErrorResponse(res, 500, 'Failed to create order', { error: err.message });
  }
};

/**
 * Update order status (Admin only)
 * @route PUT /api/orders/:id
 * @access Admin only
 */
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return sendErrorResponse(res, 400, 'Order ID is required');
    }

    if (!status) {
      return sendErrorResponse(res, 400, 'Status is required');
    }

    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return sendErrorResponse(
        res,
        400,
        `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      );
    }

    const updateData = { status };
    const updated = await orderService.update(id, updateData);
    
    return sendSuccessResponse(res, 200, 'Order updated successfully', { order: updated });
  } catch (err) {
    console.error('Error in updateOrder controller:', err);
    
    if (err.message.includes('not found')) {
      return sendNotFoundResponse(res, 'Order not found');
    }
    
    return sendErrorResponse(res, 500, 'Failed to update order', { error: err.message });
  }
};

/**
 * Delete order (Admin only)
 * @route DELETE /api/orders/:id
 * @access Admin only
 */
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return sendErrorResponse(res, 400, 'Order ID is required');
    }

    await orderService.delete(id);
    
    return sendSuccessResponse(res, 200, 'Order deleted successfully', null);
  } catch (err) {
    console.error('Error in deleteOrder controller:', err);
    
    if (err.message.includes('not found')) {
      return sendNotFoundResponse(res, 'Order not found');
    }
    
    return sendErrorResponse(res, 500, 'Failed to delete order', { error: err.message });
  }
};
