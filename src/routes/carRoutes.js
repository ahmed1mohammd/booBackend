import express from 'express';
import {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  deleteCarImage
} from '../controllers/carController.js';
import { protectAdmin } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCars)
  .post(protectAdmin, upload.array('images', 8), createCar);

router.route('/:id')
  .get(getCarById)
  .put(protectAdmin, upload.array('images', 8), updateCar)
  .delete(protectAdmin, deleteCar);

router.delete('/:id/images/:imageId', protectAdmin, deleteCarImage);

export default router;
