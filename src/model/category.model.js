/**
 * Category Model - Database query builders for categories table
 * 
 * Table: categories
 * Fields: id, name, description, created_at
 */

/**
 * Get all categories query
 * @returns {Object} Query configuration object
 */
export const getAllCategoriesQuery = () => ({
  table: 'categories'
});

/**
 * Get category by ID query
 * @param {string|number} id - Category ID
 * @returns {Object} Query configuration object
 */
export const getCategoryByIdQuery = (id) => ({
  table: 'categories',
  filter: { id }
});

/**
 * Create category query
 * @param {Object} data - Category data
 * @param {string} data.name - Category name (required)
 * @param {string} data.description - Category description
 * @returns {Object} Query configuration object
 */
export const createCategoryQuery = (data) => {
  const validData = {
    name: data.name,
    description: data.description || null
  };

  return {
    table: 'categories',
    data: validData
  };
};

/**
 * Update category query
 * @param {string|number} id - Category ID
 * @param {Object} data - Updated category data
 * @returns {Object} Query configuration object
 */
export const updateCategoryQuery = (id, data) => {
  const updateData = {};
  
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;

  return {
    table: 'categories',
    filter: { id },
    data: updateData
  };
};

/**
 * Delete category query
 * @param {string|number} id - Category ID
 * @returns {Object} Query configuration object
 */
export const deleteCategoryQuery = (id) => ({
  table: 'categories',
  filter: { id }
});

/**
 * Get products by category ID query
 * @param {string|number} categoryId - Category ID
 * @returns {Object} Query configuration object
 */
export const getProductsByCategoryQuery = (categoryId) => ({
  table: 'products',
  filter: { category_id: categoryId }
});
