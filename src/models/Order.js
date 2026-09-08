import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SparePart'
    },
    sku: { type: String, required: true },
    name: { type: String, required: true },
    brand: { type: String, default: 'BOO OEM' },
    image: { type: String, default: '' },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true }
  },
  { _id: true }
);

const orderTimelineSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    time: { type: String, default: '' },
    completed: { type: Boolean, default: false },
    current: { type: Boolean, default: false }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      email: { type: String, default: null, trim: true }
    },
    shippingAddress: {
      governorate: { type: String, required: true },
      city: { type: String, required: true },
      address: { type: String, required: true }
    },
    items: [orderItemSchema],
    pricing: {
      subtotal: { type: Number, required: true },
      shipping: { type: Number, default: 100 },
      total: { type: Number, required: true },
      currency: { type: String, default: 'EGP' }
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'failed', 'refunded'],
      default: 'unpaid'
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'preparing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      default: 'Fawaterk Secure Gateway'
    },
    fawaterkInvoiceId: {
      type: String,
      default: null
    },
    fawaterkTransactionId: {
      type: String,
      default: null
    },
    stockDeducted: {
      type: Boolean,
      default: false
    },
    timeline: [orderTimelineSchema],
    notes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
