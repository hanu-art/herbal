
/**
 * User model with Supabase integration
 * This file contains database queries and operations for user management
 */

/**
 * Get user by email
 * @param {string} email - User email
 * @returns {Object} Supabase query object
 */
export const getUserByEmail = (email) => {
  return {
    table: 'users',
    select: '*',
    filter: { email: email }
  };
};

/**
 * Get user by ID
 * @param {string} id - User ID
 * @returns {Object} Supabase query object
 */
export const getUserById = (id) => {
  return {
    table: 'users',
    select: 'id, name, email, phone, role, department, position, is_active, created_at, updated_at',
    filter: { id: id }
  };
};

/**
 * Create new user
 * @param {Object} userData - User data
 * @returns {Object} Supabase insert object
 */
export const createUser = (userData) => {
  return {
    table: 'users',
    data: {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      password: userData.password_hash,
      role: userData.role || 'user',
      is_active: true
    }
  };
};

/**
 * Update user profile
 * @param {string} id - User ID
 * @param {Object} updateData - Data to update
 * @returns {Object} Supabase update object
 */
export const updateUser = (id, updateData) => {
  return {
    table: 'users',
    filter: { id: id },
    data: updateData
  };
};

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} passwordHash - New password hash
 * @returns {Object} Supabase update object
 */
export const updateUserPassword = (id, passwordHash) => {
  return {
    table: 'users',
    filter: { id: id },
    data: {
      password: passwordHash
    }
  };
};

/**
 * Deactivate user account
 * @param {string} id - User ID
 * @returns {Object} Supabase update object
 */
export const deactivateUser = (id) => {
  return {
    table: 'users',
    filter: { id: id },
    data: {
      is_active: false
    }
  };
};

/**
 * Get all users with pagination
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Object} Supabase query object
 */
export const getAllUsers = (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return {
    table: 'users',
    select: 'id, name, email, phone, role, department, position, is_active, created_at',
    range: { from: offset, to: offset + limit - 1 },
    order: { column: 'created_at', ascending: false }
  };
};

/**
 * Search users by name or email
 * @param {string} searchTerm - Search term
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Object} Supabase query object
 */
export const searchUsers = (searchTerm, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return {
    table: 'users',
    select: 'id, name, email, phone, role, department, position, is_active, created_at',
    filter: {
      or: [
        { name: { ilike: `%${searchTerm}%` } },
        { email: { ilike: `%${searchTerm}%` } }
      ]
    },
    range: { from: offset, to: offset + limit - 1 },
    order: { column: 'created_at', ascending: false }
  };
};