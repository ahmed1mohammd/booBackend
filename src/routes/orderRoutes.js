import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getDashboardStats
} from '../controllers/orderController.js';
import { protectAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/stats/overview', protectAdmin, getDashboardStats);

router.route('/')
  .get(protectAdmin, getOrders)
  .post(createOrder);

router.route('/:orderIdOrNumber')
  .get(getOrderById);

router.route('/:id')
  .put(protectAdmin, updateOrderStatus);

export default router;
