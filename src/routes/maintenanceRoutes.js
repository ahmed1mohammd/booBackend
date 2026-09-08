import express from 'express';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} from '../controllers/maintenanceController.js';
import { protectAdmin } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getServices)
  .post(protectAdmin, upload.array('images', 4), createService);

router.route('/:id')
  .get(getServiceById)
  .put(protectAdmin, upload.array('images', 4), updateService)
  .delete(protectAdmin, deleteService);

export default router;
