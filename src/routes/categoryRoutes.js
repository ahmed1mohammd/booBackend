import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { protectAdmin } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post(protectAdmin, upload.single('image'), createCategory);

router.route('/:id')
  .get(getCategoryById)
  .put(protectAdmin, upload.single('image'), updateCategory)
  .delete(protectAdmin, deleteCategory);

export default router;
