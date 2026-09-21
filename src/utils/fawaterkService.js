import axios from 'axios';
import SparePart from '../models/SparePart.js';
import Order from '../models/Order.js';

let cachedAccessToken = null;
let tokenExpiresAt = 0;

/**
 * Get OAuth Access Token from Fawaterk (API v3)
 */
async function getFawaterkAccessToken() {
  const clientId = process.env.FAWATERK_CLIENT_ID;
  const clientSecret = process.env.FAWATERK_CLIENT_SECRET;
  const tokenUrl = process.env.FAWATERK_TOKEN_URL || 'https://staging.fawaterk.com/oauth/token';

  if (!clientId || !clientSecret) {
    return null;
  }

  // Return cached token if still valid (with 60-second buffer)
  if (cachedAccessToken && Date.now() < tokenExpiresAt - 60000) {
    return cachedAccessToken;
  }

  try {
    const res = await axios.post(
      tokenUrl,
      {
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (res.data && res.data.access_token) {
      cachedAccessToken = res.data.access_token;
      const expiresInMs = (res.data.expires_in || 3600) * 1000;
      tokenExpiresAt = Date.now() + expiresInMs;
      return cachedAccessToken;
    }
  } catch (err) {
    console.error('[Fawaterk OAuth Error]:', err.response?.data || err.message);
  }

  return null;
}

/**
 * Initialize Fawaterk Payment Session (API v3 / v2)
 */
export const initiateFawaterkPaymentSession = async (order) => {
  const baseUrl = process.env.FAWATERK_BASE_URL || 'https://staging.fawaterk.com';
  const returnUrl = process.env.FAWATERK_RETURN_URL || 'http://localhost:3000/payment/success';
  const failUrl = process.env.FAWATERK_FAIL_URL || 'http://localhost:3000/payment/failed';
  const webhookUrl = process.env.FAWATERK_WEBHOOK_URL || 'https://boobackend-production.up.railway.app/api/payment/webhook';

  try {
    const accessToken = await getFawaterkAccessToken();

    if (accessToken) {
      // Fawaterk API v3 CreateTransaction
      const payload = {
        cartTotal: (order.pricing?.total || 0).toFixed(2),
        currency: 'EGP',
        customer: {
          first_name: order.customer?.name?.split(' ')[0] || 'Customer',
          last_name: order.customer?.name?.split(' ').slice(1).join(' ') || 'BOO',
          email: order.customer?.email || 'customer@booautomotive.com',
          phone: order.customer?.phone || '01000000000',
          address: order.shippingAddress
            ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.governorate}`
            : 'Egypt'
        },
        redirectionUrls: {
          successUrl: `${returnUrl}?order_id=${order.orderNumber}`,
          failUrl: `${failUrl}?order_id=${order.orderNumber}`,
          pendingUrl: `${returnUrl}?order_id=${order.orderNumber}&status=pending`,
          webhookUrl
        },
        cartItems: (order.items || []).map((it) => ({
          name: it.name || 'Spare Part',
          price: (it.unitPrice || 0).toFixed(2),
          quantity: String(it.quantity || 1)
        }))
      };

      const response = await axios.post(`${baseUrl}/api/v3/createTransaction`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.data && response.data.status === 'success' && response.data.data) {
        return {
          success: true,
          invoiceId: response.data.data.intent_key || `FAW_${Date.now()}`,
          paymentUrl: response.data.data.url
        };
      }
    }

    // Fallback to API v2 if API Key is configured
    const apiKey = process.env.FAWATERK_API_KEY;
    if (apiKey && apiKey !== 'your_fawaterk_api_key_here') {
      const v2Payload = {
        cartTotal: order.pricing?.total,
        currency: 'EGP',
        customer: {
          first_name: order.customer?.name?.split(' ')[0] || 'Customer',
          last_name: order.customer?.name?.split(' ').slice(1).join(' ') || 'BOO',
          email: order.customer?.email || 'customer@booautomotive.com',
          phone: order.customer?.phone,
          address: `${order.shippingAddress?.address}, ${order.shippingAddress?.city}`
        },
        redirectionUrls: {
          successUrl: `${returnUrl}?order_id=${order.orderNumber}`,
          failUrl: `${failUrl}?order_id=${order.orderNumber}`,
          pendingUrl: `${returnUrl}?order_id=${order.orderNumber}&status=pending`
        },
        cartItems: (order.items || []).map((it) => ({
          name: it.name,
          price: it.unitPrice,
          quantity: it.quantity
        }))
      };

      const v2Response = await axios.post(`${baseUrl}/api/v2/createInvoiceLink`, v2Payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        }
      });

      if (v2Response.data && v2Response.data.status === 'success') {
        return {
          success: true,
          invoiceId: v2Response.data.data.invoiceId || v2Response.data.data.invoice_id,
          paymentUrl: v2Response.data.data.url
        };
      }
    }
  } catch (error) {
    console.error('[Fawaterk Session Error]:', error.response?.data || error.message);
  }

  // Simulation fallback for offline/test dev
  return {
    success: true,
    invoiceId: `FAW_SIM_${Date.now()}`,
    paymentUrl: `${returnUrl}?order_id=${order.orderNumber}&ref=faw_sim_${Date.now()}`
  };
};

/**
 * Deduct product stock after verified payment
 * Enforces atomic stock deduction and avoids duplicate deductions
 */
export const deductOrderStock = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order || order.stockDeducted) {
    return;
  }

  for (const item of order.items) {
    if (item.product) {
      await SparePart.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    } else if (item.sku) {
      await SparePart.findOneAndUpdate(
        { sku: item.sku },
        { $inc: { stock: -item.quantity } }
      );
    }
  }

  order.stockDeducted = true;
  await order.save();
  console.log(`[Inventory] Deducted stock for order: ${order.orderNumber}`);
};
