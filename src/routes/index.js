import express from 'express';
import authRoutes from './authRoutes.js';
import carRoutes from './carRoutes.js';
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
router.use('/cars', carRoutes);
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

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'BOO Automotive API is operational',
    timestamp: new Date().toISOString()
  });
});

export default router;
