import mongoose from 'mongoose';

const accessoryImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: '' },
    isMain: { type: Boolean, default: false }
  },
  { _id: true }
);

const accessorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Accessory name is required'],
      trim: true
    },
    sku: {
      type: String,
      required: [true, 'SKU / Product code is required'],
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
      default: 'accessories',
      index: true
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0
    },
    description: {
      type: String,
      default: ''
    },
    shortDescription: {
      type: String,
      default: ''
    },
    images: [accessoryImageSchema],
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

accessorySchema.index({ name: 'text', sku: 'text', brand: 'text' });
accessorySchema.index({ brand: 1, isActive: 1, featured: 1 });

export default mongoose.model('Accessory', accessorySchema);
