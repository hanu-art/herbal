import { sendSuccessResponse, sendErrorResponse } from '../utils/response.utils.js';

/**
 * Handle file upload
 * @route POST /api/upload
 * @access Private/Admin
 */
export const uploadFile = (req, res) => {
  try {
    if (!req.file) {
      return sendErrorResponse(res, 400, 'No file uploaded');
    }

    // Construct the URL to access the uploaded file
    const fileUrl = `/uploads/${req.file.filename}`;
    
    return sendSuccessResponse(res, 201, 'File uploaded successfully', {
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (error) {
    console.error('Upload error:', error);
    return sendErrorResponse(res, 500, 'Error uploading file', { error: error.message });
  }
};

/**
 * Handle multiple file uploads
 * @route POST /api/upload/multiple
 * @access Private/Admin
 */
export const uploadMultipleFiles = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return sendErrorResponse(res, 400, 'No files uploaded');
    }

    const uploadedFiles = req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      size: file.size
    }));
    
    return sendSuccessResponse(res, 201, 'Files uploaded successfully', {
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    return sendErrorResponse(res, 500, 'Error uploading files', { error: error.message });
  }
};
