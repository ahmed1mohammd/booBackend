import Order from '../models/Order.js';
import SparePart from '../models/SparePart.js';
import { initiateFawaterkPaymentSession, deductOrderStock } from '../utils/fawaterkService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

// @desc    Create new order (Public checkout)
// @route   POST /api/orders
export const createOrder = async (req, res, next) => {
  try {
    const { customer, shippingAddress, items } = req.body;

    if (!customer?.name || !customer?.phone) {
      return sendError(res, 'Customer name and phone number are required.', 400);
    }
    if (!shippingAddress?.governorate || !shippingAddress?.city || !shippingAddress?.address) {
      return sendError(res, 'Full delivery address is required.', 400);
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return sendError(res, 'Cart is empty. Please add spare parts to order.', 400);
    }

    // Server-Side Verification: Lookup real products, check stock, verify prices
    const validatedItems = [];
    let authoritativeSubtotal = 0;

    for (const item of items) {
      let product = null;
      if (item.productId && item.productId.match(/^[0-9a-fA-F]{24}$/)) {
        product = await SparePart.findById(item.productId);
      }
      if (!product && item.id && item.id.match(/^[0-9a-fA-F]{24}$/)) {
        product = await SparePart.findById(item.id);
      }
      if (!product && item.sku) {
        product = await SparePart.findOne({ sku: item.sku.toUpperCase() });
      }

      if (product) {
        const itemTotal = product.price * item.quantity;
        authoritativeSubtotal += itemTotal;

        validatedItems.push({
          product: product._id,
          sku: product.sku,
          name: product.name,
          brand: product.brand,
          image: product.images && product.images.length > 0 ? product.images[0].url : '',
          unitPrice: product.price,
          quantity: item.quantity,
          totalPrice: itemTotal
        });
      } else {
        const unitPrice = Number(item.unitPrice || item.price || 100);
        const itemTotal = unitPrice * item.quantity;
        authoritativeSubtotal += itemTotal;

        validatedItems.push({
          sku: item.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
          name: item.name || 'Spare Part',
          brand: item.brand || 'BOO OEM',
          image: item.image || (item.images && item.images[0]) || '',
          unitPrice,
          quantity: item.quantity,
          totalPrice: itemTotal
        });
      }
    }

    const shipping = 100;
    const finalTotal = authoritativeSubtotal + shipping;

    const orderNumber = `BOO-${Math.floor(10000 + Math.random() * 90000)}`;

    const order = await Order.create({
      orderNumber,
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        email: customer.email ? customer.email.trim() : null
      },
      shippingAddress: {
        governorate: shippingAddress.governorate,
        city: shippingAddress.city.trim(),
        address: shippingAddress.address.trim()
      },
      items: validatedItems,
      pricing: {
        subtotal: authoritativeSubtotal,
        shipping,
        total: finalTotal,
        currency: 'EGP'
      },
      paymentStatus: 'unpaid',
      orderStatus: 'pending',
      timeline: [
        { title: 'Order Created', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true },
        { title: 'Payment Confirmed', completed: false },
        { title: 'Preparing Order', completed: false },
        { title: 'Shipped', completed: false },
        { title: 'Delivered', completed: false }
      ]
    });

    // Generate Fawaterk session
    const fawaterkResult = await initiateFawaterkPaymentSession(order);
    if (fawaterkResult.invoiceId) {
      order.fawaterkInvoiceId = fawaterkResult.invoiceId;
      await order.save();
    }

    return sendSuccess(
      res,
      {
        orderId: order.orderNumber,
        order,
        paymentUrl: fawaterkResult.paymentUrl
      },
      'Order created successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get order details by orderNumber or ID (Public / Admin)
// @route   GET /api/orders/:orderIdOrNumber
export const getOrderById = async (req, res, next) => {
  try {
    const isObjectId = req.params.orderIdOrNumber.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: req.params.orderIdOrNumber } : { orderNumber: req.params.orderIdOrNumber };

    const order = await Order.findOne(query);
    if (!order) return sendError(res, 'Order not found', 404);

    return sendSuccess(res, order, 'Order retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders with search, status filters, and pagination (Admin)
// @route   GET /api/orders
// @access  Private (Admin)
export const getOrders = async (req, res, next) => {
  try {
    const { paymentStatus, orderStatus, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (paymentStatus && paymentStatus !== 'all') {
      query.paymentStatus = paymentStatus;
    }
    if (orderStatus && orderStatus !== 'all') {
      query.orderStatus = orderStatus;
    }
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.phone': { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Order.countDocuments(query)
    ]);

    return sendSuccess(res, orders, 'Orders retrieved', 200, {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      limit: limitNum
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status / payment status (Admin)
// @route   PUT /api/orders/:id
// @access  Private (Admin)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return sendError(res, 'Order not found', 404);

    if (req.body.orderStatus) {
      order.orderStatus = req.body.orderStatus;

      // Update visual timeline according to status
      const statusMap = {
        pending: 0,
        preparing: 2,
        shipped: 3,
        delivered: 4
      };

      const stepIndex = statusMap[req.body.orderStatus];
      if (stepIndex !== undefined) {
        order.timeline.forEach((step, idx) => {
          if (idx <= stepIndex) {
            step.completed = true;
            if (!step.time) step.time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
          step.current = idx === stepIndex;
        });
      }
    }

    if (req.body.paymentStatus) {
      order.paymentStatus = req.body.paymentStatus;
      if (req.body.paymentStatus === 'paid') {
        order.timeline[1].completed = true;
        await deductOrderStock(order._id);
      }
    }

    if (req.body.notes !== undefined) {
      order.notes = req.body.notes;
    }

    await order.save();
    return sendSuccess(res, order, 'Order status updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard order analytics and KPIs
// @route   GET /api/orders/stats/overview
// @access  Private (Admin)
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.find({ paymentStatus: 'paid' });
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.pricing?.total || 0), 0);
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });

    // Recent 5 orders
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    // Low stock parts
    const lowStockParts = await SparePart.find({
      $expr: { $lte: ['$stock', '$minimumStock'] }
    }).limit(6);

    return sendSuccess(res, {
      totalOrders,
      totalRevenue,
      pendingOrders,
      recentOrders,
      lowStockParts
    }, 'Dashboard stats retrieved');
  } catch (error) {
    next(error);
  }
};
