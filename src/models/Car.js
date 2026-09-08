import mongoose from 'mongoose';

const carImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: '' },
    isMain: { type: Boolean, default: false }
  },
  { _id: true }
);

const carSpecSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    value: { type: String, required: true }
  },
  { _id: false }
);

const carSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [true, 'Vehicle brand is required'],
      trim: true
    },
    model: {
      type: String,
      required: [true, 'Vehicle model is required'],
      trim: true
    },
    year: {
      type: Number,
      required: [true, 'Model year is required'],
      min: 1990,
      max: 2030
    },
    mileage: {
      type: String,
      default: 'Zero km'
    },
    price: {
      type: Number,
      required: [true, 'Vehicle price is required'],
      min: 0
    },
    bodyType: {
      type: String,
      enum: ['Sedan', 'SUV', 'Coupé', 'Hatchback', 'Convertible', 'Van'],
      default: 'Sedan'
    },
    fuel: {
      type: String,
      enum: ['Petrol', 'Diesel', 'Hybrid', 'Mild Hybrid', 'Electric'],
      default: 'Petrol'
    },
    transmission: {
      type: String,
      default: 'Automatic'
    },
    engine: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    specs: [carSpecSchema],
    images: [carImageSchema],
    status: {
      type: String,
      enum: ['Available', 'Reserved', 'Sold', 'Hidden'],
      default: 'Available'
    },
    featured: {
      type: Boolean,
      default: false
    },
    tags: [{ type: String }]
  },
  { timestamps: true }
);

carSchema.index({ brand: 1, model: 1, status: 1, featured: 1 });

export default mongoose.model('Car', carSchema);
