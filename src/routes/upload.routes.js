import express from 'express';
import upload from '../config/multer.config.js';
import { uploadFile, uploadMultipleFiles } from '../controllers/upload.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Single file upload
router.post(
  '/',
  authenticateToken,
  requireAdmin,
  upload.single('image'),
  uploadFile
);

// Multiple files upload (up to 5 files)
router.post(
  '/multiple',
  authenticateToken,
  requireAdmin,
  upload.array('images', 5),
  uploadMultipleFiles
);

export default router;
