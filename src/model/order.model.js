/**
 * Order Model - Database query builders for orders and order_items tables
 * 
 * Tables:
 * - orders: id, user_id, status, total_amount, created_at
 * - order_items: id, order_id, product_id, quantity, price
 */

/**
 * Get all orders query with pagination
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {Object} Query configuration object
 */
export const getAllOrdersQuery = (page = 1, limit = 10) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  return {
    table: 'orders',
    range: { from, to }
  };
};

/**
 * Get orders by user ID query with pagination
 * @param {string|number} userId - User ID
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {Object} Query configuration object
 */
export const getOrdersByUserQuery = (userId, page = 1, limit = 10) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  return {
    table: 'orders',
    filter: { user_id: userId },
    range: { from, to }
  };
};

/**
 * Get order by ID query
 * @param {string|number} id - Order ID
 * @returns {Object} Query configuration object
 */
export const getOrderByIdQuery = (id) => ({
  table: 'orders',
  filter: { id }
});

/**
 * Create order query
 * @param {Object} data - Order data
 * @param {string|number} data.user_id - User ID (required)
 * @param {string} data.status - Order status (default: 'pending')
 * @param {number} data.total_amount - Total amount (required)
 * @returns {Object} Query configuration object
 */
export const createOrderQuery = (data) => {
  const validData = {
    user_id: data.user_id,
    status: data.status || 'pending',
    total_amount: parseFloat(data.total_amount)
  };

  return {
    table: 'orders',
    data: validData
  };
};

/**
 * Update order query
 * @param {string|number} id - Order ID
 * @param {Object} data - Updated order data
 * @returns {Object} Query configuration object
 */
export const updateOrderQuery = (id, data) => {
  const updateData = {};
  
  if (data.status !== undefined) updateData.status = data.status;
  if (data.total_amount !== undefined) updateData.total_amount = parseFloat(data.total_amount);

  return {
    table: 'orders',
    filter: { id },
    data: updateData
  };
};

/**
 * Delete order query
 * @param {string|number} id - Order ID
 * @returns {Object} Query configuration object
 */
export const deleteOrderQuery = (id) => ({
  table: 'orders',
  filter: { id }
});

/**
 * Get order items by order ID query
 * @param {string|number} orderId - Order ID
 * @returns {Object} Query configuration object
 */
export const getOrderItemsQuery = (orderId) => ({
  table: 'order_items',
  filter: { order_id: orderId }
});

/**
 * Create order item query
 * @param {Object} data - Order item data
 * @param {string|number} data.order_id - Order ID (required)
 * @param {string|number} data.product_id - Product ID (required)
 * @param {number} data.quantity - Quantity (required)
 * @param {number} data.price - Price per unit (required)
 * @returns {Object} Query configuration object
 */
export const createOrderItemQuery = (data) => {
  const validData = {
    order_id: data.order_id,
    product_id: data.product_id,
    quantity: parseInt(data.quantity),
    price: parseFloat(data.price)
  };

  return {
    table: 'order_items',
    data: validData
  };
};

/**
 * Delete order items by order ID query
 * @param {string|number} orderId - Order ID
 * @returns {Object} Query configuration object
 */
export const deleteOrderItemsQuery = (orderId) => ({
  table: 'order_items',
  filter: { order_id: orderId }
});
