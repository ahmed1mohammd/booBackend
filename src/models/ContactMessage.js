import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Sender name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      default: ''
    },
    subject: {
      type: String,
      default: 'General Inquiry'
    },
    message: {
      type: String,
      required: [true, 'Message body is required']
    },
    status: {
      type: String,
      enum: ['unread', 'read', 'replied'],
      default: 'unread'
    },
    adminNotes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

export default mongoose.model('ContactMessage', contactMessageSchema);
