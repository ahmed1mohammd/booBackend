import HeroSlide from '../models/HeroSlide.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

// @desc    Get all hero slides
// @route   GET /api/slides
export const getHeroSlides = async (req, res, next) => {
  try {
    const query = req.admin ? {} : { isActive: true };
    const slides = await HeroSlide.find(query).sort({ order: 1, createdAt: 1 });
    return sendSuccess(res, slides, 'Hero slides retrieved');
  } catch (error) {
    next(error);
  }
};

// @desc    Get slide by ID
// @route   GET /api/slides/:id
export const getSlideById = async (req, res, next) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);
    if (!slide) return sendError(res, 'Slide not found', 404);
    return sendSuccess(res, slide, 'Slide retrieved');
  } catch (error) {
    next(error);
  }
};

// @desc    Create new hero slide
// @route   POST /api/slides
// @access  Private (Admin)
export const createHeroSlide = async (req, res, next) => {
  try {
    const { title, badge, description, ctaText, ctaLink, secondaryCtaText, secondaryCtaLink, order, isActive } = req.body;

    let imageObj = { url: '', publicId: '' };
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'boo-automotive/hero');
      imageObj = { url: result.url, publicId: result.publicId };
    } else if (req.body.imageUrl) {
      imageObj = { url: req.body.imageUrl, publicId: '' };
    }

    const slide = await HeroSlide.create({
      title,
      badge: badge || 'BOO Integrated Solutions',
      description,
      ctaText: ctaText || 'Explore Now',
      ctaLink: ctaLink || '/cars',
      secondaryCtaText: secondaryCtaText || '',
      secondaryCtaLink: secondaryCtaLink || '',
      image: imageObj,
      order: Number(order) || 0,
      isActive: isActive === undefined ? true : isActive === 'true' || isActive === true
    });

    return sendSuccess(res, slide, 'Hero slide created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update hero slide
// @route   PUT /api/slides/:id
// @access  Private (Admin)
export const updateHeroSlide = async (req, res, next) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);
    if (!slide) return sendError(res, 'Slide not found', 404);

    if (req.file) {
      if (slide.image?.publicId) {
        await deleteFromCloudinary(slide.image.publicId);
      }
      const result = await uploadToCloudinary(req.file.buffer, 'boo-automotive/hero');
      slide.image = { url: result.url, publicId: result.publicId };
    }

    const fields = ['title', 'badge', 'description', 'ctaText', 'ctaLink', 'secondaryCtaText', 'secondaryCtaLink', 'order', 'isActive'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) {
        slide[f] = req.body[f];
      }
    });

    await slide.save();
    return sendSuccess(res, slide, 'Hero slide updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete hero slide & clean up Cloudinary image
// @route   DELETE /api/slides/:id
// @access  Private (Admin)
export const deleteHeroSlide = async (req, res, next) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);
    if (!slide) return sendError(res, 'Slide not found', 404);

    if (slide.image?.publicId) {
      await deleteFromCloudinary(slide.image.publicId);
    }

    await slide.deleteOne();
    return sendSuccess(res, { id: req.params.id }, 'Hero slide deleted successfully');
  } catch (error) {
    next(error);
  }
};
