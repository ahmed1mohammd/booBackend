import mongoose from 'mongoose';

const sparePartImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: '' },
    isMain: { type: Boolean, default: false }
  },
  { _id: true }
);

const sparePartSpecSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    value: { type: String, required: true }
  },
  { _id: false }
);

const sparePartSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Part name is required'],
      trim: true
    },
    sku: {
      type: String,
      required: [true, 'SKU / Part number is required'],
      unique: true,
      uppercase: true,
      trim: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: false
    },
    categorySlug: {
      type: String,
      default: 'all',
      index: true
    },
    brand: {
      type: String,
      required: [true, 'Manufacturer brand is required'],
      trim: true
    },
    model: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0
    },
    stock: {
      type: Number,
      required: [true, 'Stock count is required'],
      min: 0,
      default: 0
    },
    minimumStock: {
      type: Number,
      default: 3
    },
    shortDescription: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    images: [sparePartImageSchema],
    specs: [sparePartSpecSchema],
    compatibility: [{ type: String }],
    isActive: {
      type: Boolean,
      default: true
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

sparePartSchema.index({ name: 'text', sku: 'text', brand: 'text' });

export default mongoose.model('SparePart', sparePartSchema);
