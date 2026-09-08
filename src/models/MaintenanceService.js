import mongoose from 'mongoose';

const maintenanceServiceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    price: {
      type: Number,
      default: 0
    },
    duration: {
      type: String,
      default: '1 - 2 Hours'
    },
    icon: {
      type: String,
      default: 'Wrench'
    },
    checklist: [{ type: String }],
    images: [
      {
        url: { type: String },
        publicId: { type: String }
      }
    ],
    order: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model('MaintenanceService', maintenanceServiceSchema);
