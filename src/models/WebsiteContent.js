import mongoose from 'mongoose';

const websiteContentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'main_settings'
    },
    about: {
      label: { type: String, default: 'ABOUT BOO' },
      heading: { type: String, default: 'Your Trusted Automotive Partner' },
      description: {
        type: String,
        default: 'BOO provides integrated automotive solutions including car import, vehicle sales, spare parts and professional maintenance.'
      },
      secondaryText: {
        type: String,
        default: 'Founded on principles of precision, transparency, and technical excellence.'
      },
      image: {
        url: { type: String, default: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80' },
        publicId: { type: String, default: '' }
      },
      trustIndicators: [
        {
          id: { type: String },
          title: { type: String },
          description: { type: String }
        }
      ],
      stats: [
        {
          value: { type: String },
          label: { type: String }
        }
      ]
    },
    whyBoo: [
      {
        id: { type: String },
        title: { type: String },
        description: { type: String },
        icon: { type: String }
      }
    ],
    contact: {
      address: {
        type: String,
        default: '19 El-Galaa El-Bahary Street, Shebin El-Kom, Menoufia'
      },
      addressUrl: {
        type: String,
        default: 'https://maps.google.com/?q=19+El-Galaa+El-Bahary+Street,+Shebin+El-Kom,+Menoufia'
      },
      phones: [
        {
          display: { type: String },
          raw: { type: String }
        }
      ],
      email: { type: String, default: 'info@booautomotive.com' },
      workingHours: {
        type: String,
        default: 'Saturday - Thursday: 9:00 AM - 10:00 PM | Friday: 1:00 PM - 10:00 PM'
      },
      socials: {
        whatsapp: { type: String, default: 'https://wa.me/201122559066' },
        facebook: { type: String, default: '#' },
        instagram: { type: String, default: '#' },
        email: { type: String, default: 'mailto:info@booautomotive.com' }
      }
    },
    cta: {
      heading: { type: String, default: 'Looking for the Right Automotive Solution?' },
      description: {
        type: String,
        default: 'Whether you need a car, spare parts or professional maintenance, BOO is ready to help.'
      },
      primaryButtonText: { type: String, default: 'Contact Us' },
      primaryButtonLink: { type: String, default: '/contact' },
      secondaryButtonText: { type: String, default: 'Explore Services' },
      secondaryButtonLink: { type: String, default: '/#services' }
    }
  },
  { timestamps: true }
);

export default mongoose.model('WebsiteContent', websiteContentSchema);
