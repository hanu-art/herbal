/**
 * Product Model - Database query builders for products table
 * 
 * Table: products
 * Fields: id, name, description, price, stock, image_url, category_id, created_at
 */

/**
 * Get all products query with pagination
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {Object} Query configuration object
 */
export const getAllProductsQuery = (page = 1, limit = 10) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  return { 
    table: 'products', 
    range: { from, to } 
  };
};

/**
 * Get product by ID query
 * @param {string|number} id - Product ID
 * @returns {Object} Query configuration object
 */
export const getProductByIdQuery = (id) => ({
  table: 'products',
  filter: { id }
});

/**
 * Create product query
 * @param {Object} data - Product data
 * @param {string} data.name - Product name
 * @param {string} data.description - Product description
 * @param {number} data.price - Product price
 * @param {number} data.stock - Product stock quantity
 * @param {string} data.image_url - Product image URL
 * @param {string|number} data.category_id - Category ID (optional)
 * @returns {Object} Query configuration object
 */
export const createProductQuery = (data) => {
  // Ensure only valid fields are included
  const validData = {
    name: data.name,
    description: data.description || null,
    price: parseFloat(data.price),
    stock: parseInt(data.stock) || 0,
    image_url: data.image_url || null,
    category_id: data.category_id || null
  };

  return {
    table: 'products',
    data: validData
  };
};

/**
 * Update product query
 * @param {string|number} id - Product ID
 * @param {Object} data - Updated product data
 * @returns {Object} Query configuration object
 */
export const updateProductQuery = (id, data) => {
  // Build update object with only provided fields
  const updateData = {};
  
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.price !== undefined) updateData.price = parseFloat(data.price);
  if (data.stock !== undefined) updateData.stock = parseInt(data.stock);
  if (data.image_url !== undefined) updateData.image_url = data.image_url;
  if (data.category_id !== undefined) updateData.category_id = data.category_id;

  return {
    table: 'products',
    filter: { id },
    data: updateData
  };
};

/**
 * Delete product query
 * @param {string|number} id - Product ID
 * @returns {Object} Query configuration object
 */
export const deleteProductQuery = (id) => ({
  table: 'products',
  filter: { id }
});

/**
 * Search products query with pagination
 * @param {string} searchTerm - Search term
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {Object} Query configuration object
 */
export const searchProductsQuery = (searchTerm, page = 1, limit = 10) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  return {
    table: 'products',
    filter: {
      or: [
        { name: { ilike: `%${searchTerm}%` } },
        { description: { ilike: `%${searchTerm}%` } }
      ]
    },
    range: { from, to }
  };
};
