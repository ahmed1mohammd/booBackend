import mongoose from 'mongoose';

const maintenanceBookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      required: true,
      unique: true
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    customerPhone: {
      type: String,
      required: [true, 'Customer phone is required'],
      trim: true
    },
    carModel: {
      type: String,
      required: [true, 'Vehicle model is required'],
      trim: true
    },
    serviceName: {
      type: String,
      default: 'Periodic Maintenance'
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MaintenanceService'
    },
    preferredDate: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
      default: 'pending'
    },
    notes: {
      type: String,
      default: ''
    },
    adminNotes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

export default mongoose.model('MaintenanceBooking', maintenanceBookingSchema);
