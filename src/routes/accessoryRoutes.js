import express from 'express';
import {
  getAccessories,
  getAccessoryById,
  createAccessory,
  updateAccessory,
  deleteAccessory,
  deleteAccessoryImage
} from '../controllers/accessoryController.js';
import { protectAdmin } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAccessories)
  .post(protectAdmin, upload.array('images', 8), createAccessory);

router.route('/:idOrSku')
  .get(getAccessoryById)
  .put(protectAdmin, upload.array('images', 8), updateAccessory)
  .delete(protectAdmin, deleteAccessory);

router.delete('/:id/images/:imageId', protectAdmin, deleteAccessoryImage);

export default router;
