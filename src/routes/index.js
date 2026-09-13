import express from 'express';
import authRoutes from './authRoutes.js';
import accessoryRoutes from './accessoryRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import sparePartRoutes from './sparePartRoutes.js';
import maintenanceRoutes from './maintenanceRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import orderRoutes from './orderRoutes.js';
import heroRoutes from './heroRoutes.js';
import contentRoutes from './contentRoutes.js';
import messageRoutes from './messageRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/accessories', accessoryRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', sparePartRoutes);
router.use('/services', maintenanceRoutes);
router.use('/bookings', bookingRoutes);
router.use('/orders', orderRoutes);
router.use('/slides', heroRoutes);
router.use('/content', contentRoutes);
router.use('/messages', messageRoutes);
router.use('/payment', paymentRoutes);
router.use('/upload', uploadRoutes);

import { getDbStatus, connectDB } from '../config/db.js';

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'BOO Spare Parts, Accessories & Services API is operational',
    database: getDbStatus(),
    timestamp: new Date().toISOString()
  });
});

// Diagnostic retry route
router.get('/db-retry', async (req, res) => {
  await connectDB();
  res.status(200).json({
    message: 'Triggered DB reconnect attempt',
    database: getDbStatus()
  });
});

export default router;
