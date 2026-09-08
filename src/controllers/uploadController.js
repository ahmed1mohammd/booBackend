import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

// @desc    Upload single image
// @route   POST /api/upload
// @access  Private (Admin)
export const uploadSingleImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, 'No image file uploaded', 400);
    }

    const folder = req.body.folder || 'boo-automotive/general';
    const result = await uploadToCloudinary(req.file.buffer, folder);

    return sendSuccess(res, result, 'Image uploaded successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
// @access  Private (Admin)
export const uploadMultipleImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return sendError(res, 'No image files uploaded', 400);
    }

    const folder = req.body.folder || 'boo-automotive/general';
    const results = [];

    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer, folder);
      results.push(result);
    }

    return sendSuccess(res, results, `${results.length} images uploaded successfully`);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete image by public ID
// @route   DELETE /api/upload
// @access  Private (Admin)
export const deleteImage = async (req, res, next) => {
  try {
    const { publicId } = req.body;
    if (!publicId) {
      return sendError(res, 'Public ID is required to delete image', 400);
    }

    await deleteFromCloudinary(publicId);
    return sendSuccess(res, { publicId }, 'Image deleted successfully');
  } catch (error) {
    next(error);
  }
};
