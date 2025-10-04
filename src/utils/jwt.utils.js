import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_ACCESS_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN } from '../config/env.config.js';

/**
 * Generate access token
 * @param {Object} payload - User data to include in token
 * @returns {string} Access token
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRES_IN,
    issuer: 'hr-backend',
    audience: 'hr-frontend'
  });
};

/**
 * Generate refresh token
 * @param {Object} payload - User data to include in token
 * @returns {string} Refresh token
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
    issuer: 'hr-backend',
    audience: 'hr-frontend'
  });
};

/**
 * Verify access token
 * @param {string} token - Access token to verify
 * @returns {Object} Decoded token payload
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET, {
    issuer: 'hr-backend',
    audience: 'hr-frontend'
  });
};

/**
 * Verify refresh token
 * @param {string} token - Refresh token to verify
 * @returns {Object} Decoded token payload
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, JWT_SECRET, {
    issuer: 'hr-backend',
    audience: 'hr-frontend'
  });
};

/**
 * Generate token pair (access + refresh)
 * @param {Object} payload - User data to include in tokens
 * @returns {Object} Token pair with access and refresh tokens
 */
export const generateTokenPair = (payload) => {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  
  return {
    accessToken,
    refreshToken,
    expiresIn: JWT_ACCESS_EXPIRES_IN
  };
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Extracted token or null
 */
export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};


