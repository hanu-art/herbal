/**
 * Category Controller - Request handlers for category endpoints
 * Handles HTTP requests and responses for category operations
 */

import categoryService from '../services/category.service.js';
import {
  sendSuccessResponse,
  sendErrorResponse,
  sendNotFoundResponse
} from '../utils/response.utils.js';

/**
 * Get all categories
 * @route GET /api/categories
 * @access Public
 */
export const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.findAll();
    
    return sendSuccessResponse(
      res,
      200,
      'Categories retrieved successfully',
      { categories }
    );
  } catch (err) {
    console.error('Error in getAllCategories controller:', err);
    return sendErrorResponse(res, 500, 'Failed to fetch categories', { error: err.message });
  }
};

/**
 * Get single category by ID
 * @route GET /api/categories/:id
 * @access Public
 */
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return sendErrorResponse(res, 400, 'Category ID is required');
    }

    const category = await categoryService.findById(id);
    
    if (!category) {
      return sendNotFoundResponse(res, 'Category not found');
    }

    return sendSuccessResponse(res, 200, 'Category retrieved successfully', { category });
  } catch (err) {
    console.error('Error in getCategoryById controller:', err);
    return sendErrorResponse(res, 500, 'Failed to fetch category', { error: err.message });
  }
};

/**
 * Get products by category ID
 * @route GET /api/categories/:id/products
 * @access Public
 */
export const getProductsByCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return sendErrorResponse(res, 400, 'Category ID is required');
    }

    // Check if category exists
    const category = await categoryService.findById(id);
    if (!category) {
      return sendNotFoundResponse(res, 'Category not found');
    }

    const products = await categoryService.getProductsByCategory(id);
    
    return sendSuccessResponse(
      res,
      200,
      'Products retrieved successfully',
      { category, products }
    );
  } catch (err) {
    console.error('Error in getProductsByCategory controller:', err);
    return sendErrorResponse(res, 500, 'Failed to fetch products', { error: err.message });
  }
};

/**
 * Create new category
 * @route POST /api/categories
 * @access Admin only
 */
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validate required fields
    if (!name) {
      return sendErrorResponse(res, 400, 'Category name is required');
    }

    const categoryData = {
      name: name.trim(),
      description: description ? description.trim() : null
    };

    const category = await categoryService.create(categoryData);
    
    return sendSuccessResponse(res, 201, 'Category created successfully', { category });
  } catch (err) {
    console.error('Error in createCategory controller:', err);
    
    if (err.message.includes('required')) {
      return sendErrorResponse(res, 400, err.message);
    }
    
    return sendErrorResponse(res, 500, 'Failed to create category', { error: err.message });
  }
};

/**
 * Update existing category
 * @route PUT /api/categories/:id
 * @access Admin only
 */
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!id) {
      return sendErrorResponse(res, 400, 'Category ID is required');
    }

    // Build update object
    const updateData = {};
    
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description ? description.trim() : null;

    if (Object.keys(updateData).length === 0) {
      return sendErrorResponse(res, 400, 'No fields to update');
    }

    const updated = await categoryService.update(id, updateData);
    
    return sendSuccessResponse(res, 200, 'Category updated successfully', { category: updated });
  } catch (err) {
    console.error('Error in updateCategory controller:', err);
    
    if (err.message.includes('not found')) {
      return sendNotFoundResponse(res, 'Category not found');
    }
    
    return sendErrorResponse(res, 500, 'Failed to update category', { error: err.message });
  }
};

/**
 * Delete category
 * @route DELETE /api/categories/:id
 * @access Admin only
 */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return sendErrorResponse(res, 400, 'Category ID is required');
    }

    await categoryService.delete(id);
    
    return sendSuccessResponse(res, 200, 'Category deleted successfully', null);
  } catch (err) {
    console.error('Error in deleteCategory controller:', err);
    
    if (err.message.includes('not found')) {
      return sendNotFoundResponse(res, 'Category not found');
    }
    
    if (err.message.includes('existing products')) {
      return sendErrorResponse(res, 400, err.message);
    }
    
    return sendErrorResponse(res, 500, 'Failed to delete category', { error: err.message });
  }
};
