/**
 * Category Service - Business logic layer for category operations
 * Handles all database interactions using Supabase client
 */

import {
  getAllCategoriesQuery,
  getCategoryByIdQuery,
  createCategoryQuery,
  updateCategoryQuery,
  deleteCategoryQuery,
  getProductsByCategoryQuery
} from '../model/category.model.js';
import { supabase } from '../config/supabaseClient.js';

class CategoryService {
  /**
   * Get all categories
   * @returns {Promise<Array>} Array of categories
   */
  async findAll() {
    try {
      const query = getAllCategoriesQuery();
      
      const { data, error } = await supabase
        .from(query.table)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching categories:', error);
        throw new Error(error.message);
      }

      return data || [];
    } catch (err) {
      console.error('Error in findAll service:', err);
      throw err;
    }
  }

  /**
   * Find category by ID
   * @param {string|number} id - Category ID
   * @returns {Promise<Object|null>} Category object or null if not found
   */
  async findById(id) {
    try {
      const query = getCategoryByIdQuery(id);
      
      const { data, error } = await supabase
        .from(query.table)
        .select('*')
        .eq('id', query.filter.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Supabase error finding category:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (err) {
      console.error('Error in findById service:', err);
      throw err;
    }
  }

  /**
   * Create new category
   * @param {Object} categoryData - Category data
   * @param {string} categoryData.name - Category name (required)
   * @param {string} categoryData.description - Category description
   * @returns {Promise<Object>} Created category object
   */
  async create(categoryData) {
    try {
      if (!categoryData.name) {
        throw new Error('Category name is required');
      }

      const query = createCategoryQuery(categoryData);
      
      const { data: created, error } = await supabase
        .from(query.table)
        .insert(query.data)
        .select('*')
        .single();

      if (error) {
        console.error('Supabase error creating category:', error);
        throw new Error(error.message);
      }

      return created;
    } catch (err) {
      console.error('Error in create service:', err);
      throw err;
    }
  }

  /**
   * Update existing category
   * @param {string|number} id - Category ID
   * @param {Object} updateData - Fields to update
   * @returns {Promise<Object>} Updated category object
   */
  async update(id, updateData) {
    try {
      const existing = await this.findById(id);
      if (!existing) {
        throw new Error('Category not found');
      }

      const query = updateCategoryQuery(id, updateData);
      
      const { data: updated, error } = await supabase
        .from(query.table)
        .update(query.data)
        .eq('id', query.filter.id)
        .select('*')
        .single();

      if (error) {
        console.error('Supabase error updating category:', error);
        throw new Error(error.message);
      }

      return updated;
    } catch (err) {
      console.error('Error in update service:', err);
      throw err;
    }
  }

  /**
   * Delete category by ID
   * @param {string|number} id - Category ID
   * @returns {Promise<boolean>} True if deleted successfully
   */
  async delete(id) {
    try {
      const existing = await this.findById(id);
      if (!existing) {
        throw new Error('Category not found');
      }

      // Check if category has products
      const productsQuery = getProductsByCategoryQuery(id);
      const { data: products, error: productsError } = await supabase
        .from(productsQuery.table)
        .select('id')
        .eq('category_id', productsQuery.filter.category_id)
        .limit(1);

      if (productsError) {
        console.error('Error checking category products:', productsError);
      }

      if (products && products.length > 0) {
        throw new Error('Cannot delete category with existing products');
      }

      const query = deleteCategoryQuery(id);
      
      const { error } = await supabase
        .from(query.table)
        .delete()
        .eq('id', query.filter.id);

      if (error) {
        console.error('Supabase error deleting category:', error);
        throw new Error(error.message);
      }

      return true;
    } catch (err) {
      console.error('Error in delete service:', err);
      throw err;
    }
  }

  /**
   * Get products by category ID
   * @param {string|number} categoryId - Category ID
   * @returns {Promise<Array>} Array of products
   */
  async getProductsByCategory(categoryId) {
    try {
      const query = getProductsByCategoryQuery(categoryId);
      
      const { data, error } = await supabase
        .from(query.table)
        .select('*')
        .eq('category_id', query.filter.category_id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching products by category:', error);
        throw new Error(error.message);
      }

      return data || [];
    } catch (err) {
      console.error('Error in getProductsByCategory service:', err);
      throw err;
    }
  }
}

// Export singleton instance
export default new CategoryService();
