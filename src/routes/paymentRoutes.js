import express from 'express';
import {
  verifyPaymentStatus,
  handleFawaterkWebhook,
  retryOrderPayment
} from '../controllers/paymentController.js';

const router = express.Router();

router.get('/verify/:orderNumber', verifyPaymentStatus);
router.post('/webhook', handleFawaterkWebhook);
router.post('/retry/:orderNumber', retryOrderPayment);

export default router;
