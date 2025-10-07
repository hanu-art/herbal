/**
 * Product Controller - Request handlers for product endpoints
 * Handles HTTP requests and responses for product operations
 */

import productService from '../services/product.service.js';
import { 
  sendSuccessResponse, 
  sendErrorResponse, 
  sendPaginatedResponse,
  sendNotFoundResponse 
} from '../utils/response.utils.js';

/**
 * Get all products with pagination
 * @route GET /api/products
 * @access Public
 */
export const getAllProducts = async (req, res) => {
  try {
    // Parse pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return sendErrorResponse(res, 400, 'Invalid pagination parameters');
    }

    const result = await productService.findAll(page, limit);
    
    return sendPaginatedResponse(
      res, 
      result.products, 
      page, 
      limit, 
      result.total, 
      'Products retrieved successfully'
    );
  } catch (err) {
    console.error('Error in getAllProducts controller:', err);
    return sendErrorResponse(res, 500, 'Failed to fetch products', { error: err.message });
  }
};

/**
 * Get single product by ID
 * @route GET /api/products/:id
 * @access Public
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID parameter
    if (!id) {
      return sendErrorResponse(res, 400, 'Product ID is required');
    }

    const product = await productService.findById(id);
    
    if (!product) {
      return sendNotFoundResponse(res, 'Product not found');
    }

    return sendSuccessResponse(res, 200, 'Product retrieved successfully', { product });
  } catch (err) {
    console.error('Error in getProductById controller:', err);
    return sendErrorResponse(res, 500, 'Failed to fetch product', { error: err.message });
  }
};

/**
 * Create new product
 * @route POST /api/products
 * @access Admin only
 */
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, image_url, category_id } = req.body;

    // Validate required fields
    if (!name || !price) {
      return sendErrorResponse(res, 400, 'Product name and price are required');
    }

    // Validate price
    if (isNaN(price) || parseFloat(price) < 0) {
      return sendErrorResponse(res, 400, 'Invalid price value');
    }

    // Validate stock if provided
    if (stock !== undefined && (isNaN(stock) || parseInt(stock) < 0)) {
      return sendErrorResponse(res, 400, 'Invalid stock value');
    }

    const productData = {
      name: name.trim(),
      description: description ? description.trim() : null,
      price: parseFloat(price),
      stock: stock ? parseInt(stock) : 0,
      image_url: image_url || null,
      category_id: category_id || null
    };

    const product = await productService.create(productData);
    
    return sendSuccessResponse(res, 201, 'Product created successfully', { product });
  } catch (err) {
    console.error('Error in createProduct controller:', err);
    
    // Handle specific error cases
    if (err.message.includes('required')) {
      return sendErrorResponse(res, 400, err.message);
    }
    
    return sendErrorResponse(res, 500, 'Failed to create product', { error: err.message });
  }
};

/**
 * Update existing product
 * @route PUT /api/products/:id
 * @access Admin only
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, image_url, category_id } = req.body;

    // Validate ID parameter
    if (!id) {
      return sendErrorResponse(res, 400, 'Product ID is required');
    }

    // Build update object with only provided fields
    const updateData = {};
    
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description ? description.trim() : null;
    if (price !== undefined) {
      if (isNaN(price) || parseFloat(price) < 0) {
        return sendErrorResponse(res, 400, 'Invalid price value');
      }
      updateData.price = parseFloat(price);
    }
    if (stock !== undefined) {
      if (isNaN(stock) || parseInt(stock) < 0) {
        return sendErrorResponse(res, 400, 'Invalid stock value');
      }
      updateData.stock = parseInt(stock);
    }
    if (image_url !== undefined) updateData.image_url = image_url;
    if (category_id !== undefined) updateData.category_id = category_id;

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return sendErrorResponse(res, 400, 'No fields to update');
    }

    const updated = await productService.update(id, updateData);
    
    return sendSuccessResponse(res, 200, 'Product updated successfully', { product: updated });
  } catch (err) {
    console.error('Error in updateProduct controller:', err);
    
    // Handle specific error cases
    if (err.message.includes('not found')) {
      return sendNotFoundResponse(res, 'Product not found');
    }
    
    return sendErrorResponse(res, 500, 'Failed to update product', { error: err.message });
  }
};

/**
 * Delete product
 * @route DELETE /api/products/:id
 * @access Admin only
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID parameter
    if (!id) {
      return sendErrorResponse(res, 400, 'Product ID is required');
    }

    await productService.delete(id);
    
    return sendSuccessResponse(res, 200, 'Product deleted successfully', null);
  } catch (err) {
    console.error('Error in deleteProduct controller:', err);
    
    // Handle specific error cases
    if (err.message.includes('not found')) {
      return sendNotFoundResponse(res, 'Product not found');
    }
    
    return sendErrorResponse(res, 500, 'Failed to delete product', { error: err.message });
  }
};
