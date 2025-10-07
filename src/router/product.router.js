/**
 * Product Router - Route definitions for product endpoints
 * Defines all product-related routes with appropriate middleware
 */

import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * Rate limiter configuration
 * Limits requests to prevent abuse
 */
const productLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per window
  message: { 
    success: false, 
    status: 429, 
    message: 'Too many requests from this IP, please try again later' 
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiter to all product routes
router.use(productLimiter);

/**
 * Public Routes
 * These routes are accessible without authentication
 */

// @route   GET /api/products
// @desc    Get all products with pagination
// @access  Public
router.get('/', getAllProducts);

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', getProductById);

/**
 * Protected Routes (Admin Only)
 * These routes require authentication and admin role
 */

// @route   POST /api/products
// @desc    Create new product
// @access  Admin only
router.post('/', authenticateToken, requireAdmin, createProduct);

// @route   PUT /api/products/:id
// @desc    Update existing product
// @access  Admin only
router.put('/:id', authenticateToken, requireAdmin, updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Admin only
router.delete('/:id', authenticateToken, requireAdmin, deleteProduct);

export default router;
