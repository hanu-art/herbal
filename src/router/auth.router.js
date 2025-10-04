import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
  changePassword
} from '../controllers/auth.controller.js';
import {
  validateRegistration,
  validateLogin,
  validateChangePassword,
  validateProfileUpdate
} from '../validators/auth.validator.js';
import { validateRequest, sanitizeInput } from '../middleware/validation/validation.middleware.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    status: 429,
    message: 'Too many authentication attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: {
    success: false,
    status: 429,
    message: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Public routes
router.post('/register', 
  generalLimiter,
  sanitizeInput,
  validateRegistration,
  validateRequest,
  register
);

router.post('/login', 
  authLimiter,
  sanitizeInput,
  validateLogin,
  validateRequest,
  login
);

router.post('/refresh-token',
  generalLimiter,
  sanitizeInput,
  refreshToken
);

// Protected routes
router.use(authenticateToken); // All routes below require authentication

router.post('/logout', logout);

router.get('/profile', getProfile);

router.put('/profile',
  sanitizeInput,
  validateProfileUpdate,
  validateRequest,
  updateProfile
);

router.put('/change-password',
  authLimiter,
  sanitizeInput,
  validateChangePassword,
  validateRequest,
  changePassword
);

export default router;