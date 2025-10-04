import userService from '../services/user.service.js';
import { hashPassword, comparePassword } from '../utils/crypto.utils.js';
import { generateTokenPair, verifyRefreshToken } from '../utils/jwt.utils.js';
import { 
  sendSuccessResponse, 
  sendErrorResponse, 
  sendUnauthorizedResponse,
  sendNotFoundResponse 
} from '../utils/response.utils.js';

/**
 * Register new user
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role = 'user' } = req.body;

    const existingUser = await userService.findByEmail(email);
    if (existingUser) {
      return sendErrorResponse(res, 409, 'User with this email already exists');
    }

    const passwordHash = await hashPassword(password);

    const userData = {
      name,
      email,
      phone,
      password_hash: passwordHash,
      role
    };

    const newUser = await userService.create(userData);

    // Remove sensitive data
    delete newUser.password;

    return sendSuccessResponse(res, 201, 'User registered successfully', { user: newUser });
  } catch (error) {
    console.error('Registration error:', error);
    return sendErrorResponse(res, 500, 'Failed to register user');
  }
};

/**
 * Login user
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userService.findByEmail(email);
    if (!user) return sendUnauthorizedResponse(res, 'Invalid email or password');

    // Convert is_active to boolean safely
    const isActive = user.is_active === true || user.is_active === 't';
    if (!isActive) return sendUnauthorizedResponse(res, 'Account is deactivated');

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) return sendUnauthorizedResponse(res, 'Invalid email or password');

    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      department: user.department,
      position: user.position
    };

    return sendSuccessResponse(res, 200, 'Login successful', { user: userResponse, tokens });
  } catch (error) {
    console.error('Login error:', error);
    return sendErrorResponse(res, 500, 'Failed to login');
  }
};

/**
 * Refresh access token
 */
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return sendUnauthorizedResponse(res, 'Refresh token is required');

    const decoded = verifyRefreshToken(refreshToken);
    const user = await userService.findById(decoded.userId);
    if (!user) return sendUnauthorizedResponse(res, 'User not found');

    const isActive = user.is_active === true || user.is_active === 't';
    if (!isActive) return sendUnauthorizedResponse(res, 'Account is deactivated');

    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    return sendSuccessResponse(res, 200, 'Token refreshed successfully', { tokens });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return sendUnauthorizedResponse(res, 'Invalid refresh token');
    }
    if (error.name === 'TokenExpiredError') {
      return sendUnauthorizedResponse(res, 'Refresh token has expired');
    }
    console.error('Refresh token error:', error);
    return sendErrorResponse(res, 500, 'Failed to refresh token');
  }
};

/**
 * Logout user
 */
export const logout = async (req, res) => {
  try {
    return sendSuccessResponse(res, 200, 'Logout successful');
  } catch (error) {
    console.error('Logout error:', error);
    return sendErrorResponse(res, 500, 'Failed to logout');
  }
};

/**
 * Get user profile
 */
export const getProfile = async (req, res) => {
  try {
    const user = await userService.findById(req.user.id);
    if (!user) return sendNotFoundResponse(res, 'User not found');

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      department: user.department,
      position: user.position,
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    return sendSuccessResponse(res, 200, 'Profile retrieved successfully', { user: userResponse });
  } catch (error) {
    console.error('Get profile error:', error);
    return sendErrorResponse(res, 500, 'Failed to retrieve profile');
  }
};

/**
 * Update profile
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, department, position } = req.body;
    const userId = req.user.id;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (department) updateData.department = department;
    if (position) updateData.position = position;

    const updatedUser = await userService.update(userId, updateData);

    return sendSuccessResponse(res, 200, 'Profile updated successfully', { user: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    return sendErrorResponse(res, 500, 'Failed to update profile');
  }
};

/**
 * Change password
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await userService.findByEmail(req.user.email);
    if (!user) return sendNotFoundResponse(res, 'User not found');

    const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) return sendUnauthorizedResponse(res, 'Current password is incorrect');

    const newPasswordHash = await hashPassword(newPassword);
    await userService.updatePassword(userId, newPasswordHash);

    return sendSuccessResponse(res, 200, 'Password changed successfully');
  } catch (error) {
    console.error('Change password error:', error);
    return sendErrorResponse(res, 500, 'Failed to change password');
  }
};
