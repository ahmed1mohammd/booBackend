import express from 'express';
import {
  createBooking,
  getBookings,
  updateBookingStatus,
  deleteBooking
} from '../controllers/bookingController.js';
import { protectAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protectAdmin, getBookings)
  .post(createBooking);

router.route('/:id')
  .put(protectAdmin, updateBookingStatus)
  .delete(protectAdmin, deleteBooking);

export default router;
