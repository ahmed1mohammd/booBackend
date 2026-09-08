import express from 'express';
import {
  getSpareParts,
  getSparePartById,
  createSparePart,
  updateSparePart,
  deleteSparePart
} from '../controllers/sparePartController.js';
import { protectAdmin } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getSpareParts)
  .post(protectAdmin, upload.array('images', 8), createSparePart);

router.route('/:idOrSku')
  .get(getSparePartById)
  .put(protectAdmin, upload.array('images', 8), updateSparePart)
  .delete(protectAdmin, deleteSparePart);

export default router;
