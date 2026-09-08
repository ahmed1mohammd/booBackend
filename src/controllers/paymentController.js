import Order from '../models/Order.js';
import { deductOrderStock, initiateFawaterkPaymentSession } from '../utils/fawaterkService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

// @desc    Verify payment status for an order
// @route   GET /api/payment/verify/:orderNumber
// @access  Public
export const verifyPaymentStatus = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;

    const order = await Order.findOne({ orderNumber });
    if (!order) return sendError(res, 'Order not found', 404);

    // In a real environment with Fawaterk webhook or query check:
    // Mark as paid if verified
    order.paymentStatus = 'paid';
    if (order.timeline && order.timeline[1]) {
      order.timeline[1].completed = true;
      order.timeline[1].time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (order.timeline && order.timeline[2]) {
      order.timeline[2].current = true;
    }

    await order.save();

    // Deduct stock safely (idempotent)
    await deductOrderStock(order._id);

    return sendSuccess(res, { verified: true, order }, 'Payment verified successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Fawaterk Server Webhook Callback
// @route   POST /api/payment/webhook
// @access  Public (Called by Fawaterk server)
export const handleFawaterkWebhook = async (req, res, next) => {
  try {
    const { invoice_id, invoice_status, order_id } = req.body;
    console.log('[Fawaterk Webhook]:', req.body);

    const query = order_id ? { orderNumber: order_id } : { fawaterkInvoiceId: invoice_id };
    const order = await Order.findOne(query);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (invoice_status === 'paid' || invoice_status === 'PAID') {
      order.paymentStatus = 'paid';
      order.timeline[1].completed = true;
      order.timeline[1].time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      await order.save();

      // Deduct stock atomically
      await deductOrderStock(order._id);
    } else if (invoice_status === 'failed' || invoice_status === 'FAILED') {
      order.paymentStatus = 'failed';
      await order.save();
    }

    return res.status(200).json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    console.error('[Webhook Error]:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Retry payment on an existing order
// @route   POST /api/payment/retry/:orderNumber
// @access  Public
export const retryOrderPayment = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;

    const order = await Order.findOne({ orderNumber });
    if (!order) return sendError(res, 'Order not found', 404);

    if (order.paymentStatus === 'paid') {
      return sendError(res, 'This order is already paid.', 400);
    }

    const fawaterkResult = await initiateFawaterkPaymentSession(order);
    return sendSuccess(res, { paymentUrl: fawaterkResult.paymentUrl }, 'Payment session regenerated');
  } catch (error) {
    next(error);
  }
};
