import WebsiteContent from '../models/WebsiteContent.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

// @desc    Get website content & branding settings
// @route   GET /api/content
export const getWebsiteContent = async (req, res, next) => {
  try {
    let content = await WebsiteContent.findOne({ key: 'main_settings' });

    if (!content) {
      // Create initial default settings document if not present
      content = await WebsiteContent.create({ key: 'main_settings' });
    }

    return sendSuccess(res, content, 'Website content retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Update website content & branding settings
// @route   PUT /api/content
// @access  Private (Admin)
export const updateWebsiteContent = async (req, res, next) => {
  try {
    let content = await WebsiteContent.findOne({ key: 'main_settings' });
    if (!content) {
      content = new WebsiteContent({ key: 'main_settings' });
    }

    if (req.file) {
      if (content.about?.image?.publicId) {
        await deleteFromCloudinary(content.about.image.publicId);
      }
      const result = await uploadToCloudinary(req.file.buffer, 'boo-automotive/branding');
      if (!content.about) content.about = {};
      content.about.image = { url: result.url, publicId: result.publicId };
    }

    if (req.body.about) {
      content.about = { ...content.about.toObject(), ...req.body.about };
    }
    if (req.body.whyBoo) {
      content.whyBoo = req.body.whyBoo;
    }
    if (req.body.contact) {
      content.contact = { ...content.contact.toObject(), ...req.body.contact };
    }
    if (req.body.cta) {
      content.cta = { ...content.cta.toObject(), ...req.body.cta };
    }

    await content.save();
    return sendSuccess(res, content, 'Website content updated successfully');
  } catch (error) {
    next(error);
  }
};
