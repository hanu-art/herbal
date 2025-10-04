import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  getAllUsers,
  getUserById,
  searchUsers,
  updateUser,
  deactivateUser
} from '../controllers/user.controller.js';
import { authenticateToken, requireAdmin, requireManager } from '../middleware/auth.middleware.js';
import { sanitizeInput } from '../middleware/validation/validation.middleware.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Rate limiting
const userLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    status: 429,
    message: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiting to all routes
router.use(userLimiter);

// Public user routes (require authentication)
router.get('/search', sanitizeInput, searchUsers);
router.get('/:id', sanitizeInput, getUserById);

// Manager and Admin routes
router.get('/', sanitizeInput, requireManager, getAllUsers);

// Admin only routes
router.put('/:id', sanitizeInput, requireAdmin, updateUser);
router.delete('/:id', sanitizeInput, requireAdmin, deactivateUser);

export default router;


