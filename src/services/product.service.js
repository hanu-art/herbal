/**
 * Product Service - Business logic layer for product operations
 * Handles all database interactions using Supabase client
 */

import { 
  getAllProductsQuery, 
  getProductByIdQuery, 
  createProductQuery, 
  updateProductQuery, 
  deleteProductQuery, 
  searchProductsQuery 
} from '../model/product.model.js';
import { supabase } from '../config/supabaseClient.js';

class ProductService {
  /**
   * Get all products with pagination
   * @param {number} page - Current page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Products array with pagination metadata
   */
  async findAll(page = 1, limit = 10) {
    try {
      const query = getAllProductsQuery(page, limit);
      
      // Fetch products with count for pagination
      const { data, error, count } = await supabase
        .from(query.table)
        .select('*', { count: 'exact' })
        .range(query.range.from, query.range.to)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching products:', error);
        throw new Error(error.message);
      }

      return { 
        products: data || [], 
        total: count || 0, 
        page, 
        limit 
      };
    } catch (err) {
      console.error('Error in findAll service:', err);
      throw err;
    }
  }

  /**
   * Find product by ID
   * @param {string|number} id - Product ID
   * @returns {Promise<Object|null>} Product object or null if not found
   */
  async findById(id) {
    try {
      const query = getProductByIdQuery(id);
      
      const { data, error } = await supabase
        .from(query.table)
        .select('*')
        .eq('id', query.filter.id)
        .single();

      // PGRST116 is "not found" error code in PostgREST
      if (error && error.code !== 'PGRST116') {
        console.error('Supabase error finding product:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (err) {
      console.error('Error in findById service:', err);
      throw err;
    }
  }

  /**
   * Create new product
   * @param {Object} productData - Product data
   * @param {string} productData.name - Product name (required)
   * @param {string} productData.description - Product description
   * @param {number} productData.price - Product price (required)
   * @param {number} productData.stock - Stock quantity
   * @param {string} productData.image_url - Image URL
   * @param {string|number} productData.category_id - Category ID
   * @returns {Promise<Object>} Created product object
   */
  async create(productData) {
    try {
      // Validate required fields
      if (!productData.name || !productData.price) {
        throw new Error('Product name and price are required');
      }

      const query = createProductQuery(productData);
      
      const { data: created, error } = await supabase
        .from(query.table)
        .insert(query.data)
        .select('*')
        .single();

      if (error) {
        console.error('Supabase error creating product:', error);
        throw new Error(error.message);
      }

      return created;
    } catch (err) {
      console.error('Error in create service:', err);
      throw err;
    }
  }

  /**
   * Update existing product
   * @param {string|number} id - Product ID
   * @param {Object} updateData - Fields to update
   * @returns {Promise<Object>} Updated product object
   */
  async update(id, updateData) {
    try {
      // Check if product exists first
      const existing = await this.findById(id);
      if (!existing) {
        throw new Error('Product not found');
      }

      const query = updateProductQuery(id, updateData);
      
      const { data: updated, error } = await supabase
        .from(query.table)
        .update(query.data)
        .eq('id', query.filter.id)
        .select('*')
        .single();

      if (error) {
        console.error('Supabase error updating product:', error);
        throw new Error(error.message);
      }

      return updated;
    } catch (err) {
      console.error('Error in update service:', err);
      throw err;
    }
  }

  /**
   * Delete product by ID
   * @param {string|number} id - Product ID
   * @returns {Promise<boolean>} True if deleted successfully
   */
  async delete(id) {
    try {
      // Check if product exists first
      const existing = await this.findById(id);
      if (!existing) {
        throw new Error('Product not found');
      }

      const query = deleteProductQuery(id);
      
      const { error } = await supabase
        .from(query.table)
        .delete()
        .eq('id', query.filter.id);

      if (error) {
        console.error('Supabase error deleting product:', error);
        throw new Error(error.message);
      }

      return true;
    } catch (err) {
      console.error('Error in delete service:', err);
      throw err;
    }
  }

  /**
   * Search products by name or description
   * @param {string} searchTerm - Search term
   * @param {number} page - Current page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Search results with pagination
   */
  async search(searchTerm, page = 1, limit = 10) {
    try {
      const query = searchProductsQuery(searchTerm, page, limit);
      
      // Build search filter for name and description
      const searchPattern = `%${searchTerm}%`;
      
      const { data, error, count } = await supabase
        .from(query.table)
        .select('*', { count: 'exact' })
        .or(`name.ilike.${searchPattern},description.ilike.${searchPattern}`)
        .range(query.range.from, query.range.to)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error searching products:', error);
        throw new Error(error.message);
      }

      return { 
        products: data || [], 
        total: count || 0, 
        page, 
        limit 
      };
    } catch (err) {
      console.error('Error in search service:', err);
      throw err;
    }
  }
}

// Export singleton instance
export default new ProductService();