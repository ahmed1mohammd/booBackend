import Order from '../models/Order.js';
import { deductOrderStock, initiateFawaterkPaymentSession, checkFawaterkInvoiceStatus } from '../utils/fawaterkService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

// @desc    Verify payment status for an order
// @route   GET /api/payment/verify/:orderNumber
// @access  Public
export const verifyPaymentStatus = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;

    const order = await Order.findOne({ orderNumber });
    if (!order) return sendError(res, 'Order not found', 404);

    // If order is already confirmed as paid
    if (order.paymentStatus === 'paid') {
      return sendSuccess(res, { verified: true, paymentStatus: 'paid', order }, 'Payment confirmed');
    }

    // Authoritative inquiry against Fawaterk API if invoiceId exists
    if (order.fawaterkInvoiceId && !order.fawaterkInvoiceId.startsWith('FAW_SIM_')) {
      const fawaterkStatus = await checkFawaterkInvoiceStatus(order.fawaterkInvoiceId);

      if (fawaterkStatus) {
        if (fawaterkStatus.paid) {
          order.paymentStatus = 'paid';
          if (order.timeline && order.timeline[1]) {
            order.timeline[1].completed = true;
            order.timeline[1].time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
          if (order.timeline && order.timeline[2]) {
            order.timeline[2].current = true;
          }
          await order.save();
          await deductOrderStock(order._id);
          return sendSuccess(res, { verified: true, paymentStatus: 'paid', order }, 'Payment verified & confirmed');
        } else if (fawaterkStatus.isFailed) {
          order.paymentStatus = 'failed';
          await order.save();
          return sendSuccess(res, { verified: false, paymentStatus: 'failed', order }, 'Payment failed or canceled');
        } else {
          // Reference code generated, waiting for customer cash payment
          order.paymentStatus = 'pending';
          await order.save();
          return sendSuccess(res, { verified: false, paymentStatus: 'pending', order }, 'Order pending payment');
        }
      }
    }

    const isVerified = order.paymentStatus === 'paid';
    return sendSuccess(res, { verified: isVerified, paymentStatus: order.paymentStatus || 'pending', order }, 'Order status retrieved');
  } catch (error) {
    next(error);
  }
};

// @desc    Fawaterk Server Webhook Callback
// @route   POST /api/payment/webhook
// @access  Public (Called by Fawaterk server)
export const handleFawaterkWebhook = async (req, res, next) => {
  try {
    const { invoice_id, invoice_status, status, transaction_status, order_id, merchant_reference } = req.body;
    console.log('[Fawaterk Webhook Payload]:', req.body);

    const targetOrderNumber = order_id || merchant_reference;
    const query = targetOrderNumber ? { orderNumber: targetOrderNumber } : { fawaterkInvoiceId: invoice_id };
    const order = await Order.findOne(query);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const rawStatus = (invoice_status || status || transaction_status || '').toString().toLowerCase();

    if (rawStatus === 'paid' || rawStatus === 'success') {
      order.paymentStatus = 'paid';
      if (order.timeline && order.timeline[1]) {
        order.timeline[1].completed = true;
        order.timeline[1].time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      await order.save();

      // Deduct stock atomically
      await deductOrderStock(order._id);
    } else if (['failed', 'fail', 'canceled', 'cancel', 'expired'].includes(rawStatus)) {
      order.paymentStatus = 'failed';
      await order.save();
    }

    return res.status(200).json({ success: true, message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('[Webhook Processing Error]:', error);
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
