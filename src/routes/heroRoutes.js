import express from 'express';
import {
  getHeroSlides,
  getSlideById,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide
} from '../controllers/heroController.js';
import { protectAdmin } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getHeroSlides)
  .post(protectAdmin, upload.single('image'), createHeroSlide);

router.route('/:id')
  .get(getSlideById)
  .put(protectAdmin, upload.single('image'), updateHeroSlide)
  .delete(protectAdmin, deleteHeroSlide);

export default router;
