import express from 'express';
import { getWebsiteContent, updateWebsiteContent } from '../controllers/contentController.js';
import { protectAdmin } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getWebsiteContent)
  .put(protectAdmin, upload.single('image'), updateWebsiteContent);

export default router;
