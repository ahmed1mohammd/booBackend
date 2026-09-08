import mongoose from 'mongoose';

const heroSlideSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Slide title is required'],
      trim: true
    },
    badge: {
      type: String,
      default: 'BOO Integrated Solutions'
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    ctaText: {
      type: String,
      default: 'Explore Now'
    },
    ctaLink: {
      type: String,
      default: '/cars'
    },
    secondaryCtaText: {
      type: String,
      default: ''
    },
    secondaryCtaLink: {
      type: String,
      default: ''
    },
    image: {
      url: { type: String, required: true },
      publicId: { type: String, default: '' }
    },
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

export default mongoose.model('HeroSlide', heroSlideSchema);
