import MaintenanceService from '../models/MaintenanceService.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

// @desc    Get all maintenance services
// @route   GET /api/services
export const getServices = async (req, res, next) => {
  try {
    const query = req.admin ? {} : { isActive: true };
    const services = await MaintenanceService.find(query).sort({ order: 1, createdAt: 1 });
    return sendSuccess(res, services, 'Maintenance services retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get single maintenance service
// @route   GET /api/services/:idOrSlug
export const getServiceById = async (req, res, next) => {
  try {
    const isObjectId = req.params.idOrSlug.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: req.params.idOrSlug } : { slug: req.params.idOrSlug };

    const service = await MaintenanceService.findOne(query);
    if (!service) return sendError(res, 'Maintenance service not found', 404);

    return sendSuccess(res, service, 'Service details retrieved');
  } catch (error) {
    next(error);
  }
};

// @desc    Create maintenance service
// @route   POST /api/services
// @access  Private (Admin)
export const createService = async (req, res, next) => {
  try {
    const { title, slug, description, price, duration, icon, checklist, order, isActive } = req.body;

    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const uploadedImages = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, 'boo-automotive/maintenance');
        uploadedImages.push({ url: result.url, publicId: result.publicId });
      }
    }

    const parsedChecklist = typeof checklist === 'string' ? JSON.parse(checklist) : checklist || [];

    const service = await MaintenanceService.create({
      title,
      slug: generatedSlug,
      description,
      price: Number(price) || 0,
      duration: duration || '1 - 2 Hours',
      icon: icon || 'Wrench',
      checklist: parsedChecklist,
      order: Number(order) || 0,
      images: uploadedImages,
      isActive: isActive === undefined ? true : isActive === 'true' || isActive === true
    });

    return sendSuccess(res, service, 'Maintenance service created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update maintenance service
// @route   PUT /api/services/:id
// @access  Private (Admin)
export const updateService = async (req, res, next) => {
  try {
    const service = await MaintenanceService.findById(req.params.id);
    if (!service) return sendError(res, 'Service not found', 404);

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, 'boo-automotive/maintenance');
        service.images.push({ url: result.url, publicId: result.publicId });
      }
    }

    const fields = ['title', 'slug', 'description', 'price', 'duration', 'icon', 'order', 'isActive'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) {
        service[f] = req.body[f];
      }
    });

    if (req.body.checklist) {
      service.checklist = typeof req.body.checklist === 'string' ? JSON.parse(req.body.checklist) : req.body.checklist;
    }

    await service.save();
    return sendSuccess(res, service, 'Maintenance service updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete maintenance service
// @route   DELETE /api/services/:id
// @access  Private (Admin)
export const deleteService = async (req, res, next) => {
  try {
    const service = await MaintenanceService.findById(req.params.id);
    if (!service) return sendError(res, 'Service not found', 404);

    for (const img of service.images) {
      if (img.publicId) await deleteFromCloudinary(img.publicId);
    }

    await service.deleteOne();
    return sendSuccess(res, { id: req.params.id }, 'Maintenance service deleted successfully');
  } catch (error) {
    next(error);
  }
};
