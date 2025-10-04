import { supabase } from '../config/supabaseClient.js';
import { 
  getUserByEmail, 
  getUserById, 
  createUser, 
  updateUser, 
  updateUserPassword, 
  deactivateUser,
  getAllUsers,
  searchUsers
} from '../model/userQuery.model.js';
import { generateUUID } from '../utils/crypto.utils.js';

/**
 * User service class for Supabase operations
 */
class UserService {
  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Object|null} User object or null
   */
  async findByEmail(email) {
    try {
      const query = getUserByEmail(email);
      const { data, error } = await supabase
        .from(query.table)
        .select(query.select)
        .eq('email', query.filter.email)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  /**
   * Find user by ID
   * @param {string} id - User ID
   * @returns {Object|null} User object or null
   */
  async findById(id) {
    try {
      const query = getUserById(id);
      const { data, error } = await supabase
        .from(query.table)
        .select(query.select)
        .eq('id', query.filter.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  /**
   * Create new user
   * @param {Object} userData - User data
   * @returns {Object} Created user object
   */
  async create(userData) {
    try {
      const query = createUser(userData);

      const { data, error } = await supabase
        .from(query.table)
        .insert(query.data)
        .select('id, name, email, phone, role, department, position, is_active, created_at')
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   * @param {string} id - User ID
   * @param {Object} updateData - Data to update
   * @returns {Object} Updated user object
   */
  async update(id, updateData) {
    try {
      const query = updateUser(id, updateData);

      const { data, error } = await supabase
        .from(query.table)
        .update(query.data)
        .eq('id', query.filter.id)
        .select('id, name, email, phone, role, department, position, updated_at')
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Update user password
   * @param {string} id - User ID
   * @param {string} passwordHash - New password hash
   * @returns {boolean} Success status
   */
  async updatePassword(id, passwordHash) {
    try {
      const query = updateUserPassword(id, passwordHash);

      const { error } = await supabase
        .from(query.table)
        .update(query.data)
        .eq('id', query.filter.id);

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }

  /**
   * Deactivate user account
   * @param {string} id - User ID
   * @returns {boolean} Success status
   */
  async deactivate(id) {
    try {
      const query = deactivateUser(id);

      const { error } = await supabase
        .from(query.table)
        .update(query.data)
        .eq('id', query.filter.id);

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  }

  /**
   * Get all users with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Object} Users and pagination info
   */
  async findAll(page = 1, limit = 10) {
    try {
      const query = getAllUsers(page, limit);

      const { data, error, count } = await supabase
        .from(query.table)
        .select(query.select, { count: 'exact' })
        .range(query.range.from, query.range.to)
        .order(query.order.column, { ascending: query.order.ascending });

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return {
        users: data || [],
        total: count || 0,
        page,
        limit
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Search users by name or email
   * @param {string} searchTerm - Search term
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Object} Users and pagination info
   */
  async search(searchTerm, page = 1, limit = 10) {
    try {
      const query = searchUsers(searchTerm, page, limit);

      const { data, error, count } = await supabase
        .from(query.table)
        .select(query.select, { count: 'exact' })
        .or(query.filter.or.map(condition => 
          Object.entries(condition).map(([key, value]) => 
            `${key}.${Object.keys(value)[0]}.${Object.values(value)[0]}`
          ).join(',')
        ).join(','))
        .range(query.range.from, query.range.to)
        .order(query.order.column, { ascending: query.order.ascending });

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return {
        users: data || [],
        total: count || 0,
        page,
        limit
      };
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }
}

export default new UserService();


