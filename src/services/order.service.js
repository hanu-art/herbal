/**
 * Order Service - Business logic layer for order operations
 * Handles all database interactions using Supabase client
 * Manages both orders and order_items tables
 */

import {
  getAllOrdersQuery,
  getOrdersByUserQuery,
  getOrderByIdQuery,
  createOrderQuery,
  updateOrderQuery,
  deleteOrderQuery,
  getOrderItemsQuery,
  createOrderItemQuery,
  deleteOrderItemsQuery
} from '../model/order.model.js';
import { supabase } from '../config/supabaseClient.js';

class OrderService {
  /**
   * Get all orders with pagination (Admin only)
   * @param {number} page - Current page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Orders array with pagination metadata
   */
  async findAll(page = 1, limit = 10) {
    try {
      const query = getAllOrdersQuery(page, limit);
      
      const { data, error, count } = await supabase
        .from(query.table)
        .select('*', { count: 'exact' })
        .range(query.range.from, query.range.to)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching orders:', error);
        throw new Error(error.message);
      }

      return {
        orders: data || [],
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
   * Get orders by user ID with pagination
   * @param {string|number} userId - User ID
   * @param {number} page - Current page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Orders array with pagination metadata
   */
  async findByUser(userId, page = 1, limit = 10) {
    try {
      const query = getOrdersByUserQuery(userId, page, limit);
      
      const { data, error, count } = await supabase
        .from(query.table)
        .select('*', { count: 'exact' })
        .eq('user_id', query.filter.user_id)
        .range(query.range.from, query.range.to)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching user orders:', error);
        throw new Error(error.message);
      }

      return {
        orders: data || [],
        total: count || 0,
        page,
        limit
      };
    } catch (err) {
      console.error('Error in findByUser service:', err);
      throw err;
    }
  }

  /**
   * Find order by ID with items
   * @param {string|number} id - Order ID
   * @returns {Promise<Object|null>} Order object with items or null if not found
   */
  async findById(id) {
    try {
      const query = getOrderByIdQuery(id);
      
      const { data, error } = await supabase
        .from(query.table)
        .select('*')
        .eq('id', query.filter.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Supabase error finding order:', error);
        throw new Error(error.message);
      }

      if (!data) return null;

      // Fetch order items
      const items = await this.getOrderItems(id);
      
      return {
        ...data,
        items
      };
    } catch (err) {
      console.error('Error in findById service:', err);
      throw err;
    }
  }

  /**
   * Get order items by order ID
   * @param {string|number} orderId - Order ID
   * @returns {Promise<Array>} Array of order items
   */
  async getOrderItems(orderId) {
    try {
      const query = getOrderItemsQuery(orderId);
      
      const { data, error } = await supabase
        .from(query.table)
        .select('*')
        .eq('order_id', query.filter.order_id);

      if (error) {
        console.error('Supabase error fetching order items:', error);
        throw new Error(error.message);
      }

      return data || [];
    } catch (err) {
      console.error('Error in getOrderItems service:', err);
      throw err;
    }
  }

  /**
   * Create new order with items
   * @param {Object} orderData - Order data
   * @param {string|number} orderData.user_id - User ID (required)
   * @param {Array} orderData.items - Array of order items (required)
   * @param {string} orderData.status - Order status (default: 'pending')
   * @returns {Promise<Object>} Created order object with items
   */
  async create(orderData) {
    try {
      if (!orderData.user_id) {
        throw new Error('User ID is required');
      }

      if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
        throw new Error('Order must have at least one item');
      }

      // Calculate total amount
      let totalAmount = 0;
      for (const item of orderData.items) {
        if (!item.product_id || !item.quantity || !item.price) {
          throw new Error('Each item must have product_id, quantity, and price');
        }
        totalAmount += parseFloat(item.price) * parseInt(item.quantity);
      }

      // Create order
      const orderQuery = createOrderQuery({
        user_id: orderData.user_id,
        status: orderData.status || 'pending',
        total_amount: totalAmount
      });

      const { data: createdOrder, error: orderError } = await supabase
        .from(orderQuery.table)
        .insert(orderQuery.data)
        .select('*')
        .single();

      if (orderError) {
        console.error('Supabase error creating order:', orderError);
        throw new Error(orderError.message);
      }

      // Create order items
      const itemsToInsert = orderData.items.map(item => ({
        order_id: createdOrder.id,
        product_id: item.product_id,
        quantity: parseInt(item.quantity),
        price: parseFloat(item.price)
      }));

      const { data: createdItems, error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsToInsert)
        .select('*');

      if (itemsError) {
        console.error('Supabase error creating order items:', itemsError);
        // Rollback: delete the order
        await supabase.from('orders').delete().eq('id', createdOrder.id);
        throw new Error(itemsError.message);
      }

      return {
        ...createdOrder,
        items: createdItems
      };
    } catch (err) {
      console.error('Error in create service:', err);
      throw err;
    }
  }

  /**
   * Update existing order
   * @param {string|number} id - Order ID
   * @param {Object} updateData - Fields to update
   * @returns {Promise<Object>} Updated order object
   */
  async update(id, updateData) {
    try {
      const existing = await this.findById(id);
      if (!existing) {
        throw new Error('Order not found');
      }

      const query = updateOrderQuery(id, updateData);
      
      const { data: updated, error } = await supabase
        .from(query.table)
        .update(query.data)
        .eq('id', query.filter.id)
        .select('*')
        .single();

      if (error) {
        console.error('Supabase error updating order:', error);
        throw new Error(error.message);
      }

      // Fetch updated order with items
      const items = await this.getOrderItems(id);
      
      return {
        ...updated,
        items
      };
    } catch (err) {
      console.error('Error in update service:', err);
      throw err;
    }
  }

  /**
   * Delete order by ID (also deletes order items)
   * @param {string|number} id - Order ID
   * @returns {Promise<boolean>} True if deleted successfully
   */
  async delete(id) {
    try {
      const existing = await this.findById(id);
      if (!existing) {
        throw new Error('Order not found');
      }

      // Delete order items first
      const itemsQuery = deleteOrderItemsQuery(id);
      const { error: itemsError } = await supabase
        .from(itemsQuery.table)
        .delete()
        .eq('order_id', itemsQuery.filter.order_id);

      if (itemsError) {
        console.error('Supabase error deleting order items:', itemsError);
        throw new Error(itemsError.message);
      }

      // Delete order
      const query = deleteOrderQuery(id);
      const { error } = await supabase
        .from(query.table)
        .delete()
        .eq('id', query.filter.id);

      if (error) {
        console.error('Supabase error deleting order:', error);
        throw new Error(error.message);
      }

      return true;
    } catch (err) {
      console.error('Error in delete service:', err);
      throw err;
    }
  }
}

// Export singleton instance
export default new OrderService();
