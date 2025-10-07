/**
 * Order Router - Route definitions for order endpoints
 * Defines all order-related routes with appropriate middleware
 */

import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  getAllOrders,
  getUserOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
} from '../controllers/order.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * Rate limiter configuration
 */
const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    status: 429,
    message: 'Too many requests from this IP, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiter to all order routes
router.use(orderLimiter);

/**
 * All routes require authentication
 */
router.use(authenticateToken);

/**
 * Admin Routes
 */

// @route   GET /api/orders/all
// @desc    Get all orders with pagination (Admin only)
// @access  Admin only
router.get('/all', requireAdmin, getAllOrders);

/**
 * User Routes (Authenticated)
 */

// @route   GET /api/orders
// @desc    Get current user's orders with pagination
// @access  Authenticated users
router.get('/', getUserOrders);

// @route   GET /api/orders/:id
// @desc    Get single order by ID (own order or admin)
// @access  Authenticated users (own orders) or Admin
router.get('/:id', getOrderById);

// @route   POST /api/orders
// @desc    Create new order
// @access  Authenticated users
router.post('/', createOrder);

/**
 * Admin Only Routes
 */

// @route   PUT /api/orders/:id
// @desc    Update order status
// @access  Admin only
router.put('/:id', requireAdmin, updateOrder);

// @route   DELETE /api/orders/:id
// @desc    Delete order
// @access  Admin only
router.delete('/:id', requireAdmin, deleteOrder);

export default router;
