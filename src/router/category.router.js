/**
 * Category Router - Route definitions for category endpoints
 * Defines all category-related routes with appropriate middleware
 */

import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  getAllCategories,
  getCategoryById,
  getProductsByCategory,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * Rate limiter configuration
 */
const categoryLimiter = rateLimit({
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

// Apply rate limiter to all category routes
router.use(categoryLimiter);

/**
 * Public Routes
 */

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', getAllCategories);

// @route   GET /api/categories/:id
// @desc    Get single category by ID
// @access  Public
router.get('/:id', getCategoryById);

// @route   GET /api/categories/:id/products
// @desc    Get all products in a category
// @access  Public
router.get('/:id/products', getProductsByCategory);

/**
 * Protected Routes (Admin Only)
 */

// @route   POST /api/categories
// @desc    Create new category
// @access  Admin only
router.post('/', authenticateToken, requireAdmin, createCategory);

// @route   PUT /api/categories/:id
// @desc    Update existing category
// @access  Admin only
router.put('/:id', authenticateToken, requireAdmin, updateCategory);

// @route   DELETE /api/categories/:id
// @desc    Delete category
// @access  Admin only
router.delete('/:id', authenticateToken, requireAdmin, deleteCategory);

export default router;
