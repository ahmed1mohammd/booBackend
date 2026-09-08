import Car from '../models/Car.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

// @desc    Get all vehicles (Public / Admin with filters)
// @route   GET /api/cars
export const getCars = async (req, res, next) => {
  try {
    const {
      brand,
      bodyType,
      fuel,
      status,
      featured,
      search,
      sort,
      page = 1,
      limit = 20
    } = req.query;

    const query = {};

    // For public website, show only Available / Reserved by default unless status is specified
    if (status) {
      query.status = status;
    } else if (!req.admin) {
      query.status = { $ne: 'Hidden' };
    }

    if (brand && brand !== 'All') {
      query.brand = brand;
    }

    if (bodyType && bodyType !== 'All') {
      query.bodyType = bodyType;
    }

    if (fuel && fuel !== 'All') {
      query.fuel = fuel;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price-low') sortOption = { price: 1 };
    if (sort === 'price-high') sortOption = { price: -1 };
    if (sort === 'year-new') sortOption = { year: -1 };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [cars, total] = await Promise.all([
      Car.find(query).sort(sortOption).skip(skip).limit(limitNum),
      Car.countDocuments(query)
    ]);

    return sendSuccess(
      res,
      cars,
      'Cars retrieved successfully',
      200,
      {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum
      }
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get single vehicle by ID
// @route   GET /api/cars/:id
export const getCarById = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return sendError(res, 'Vehicle not found', 404);
    }
    return sendSuccess(res, car, 'Car details retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Create new vehicle
// @route   POST /api/cars
// @access  Private (Admin)
export const createCar = async (req, res, next) => {
  try {
    const {
      brand,
      model,
      year,
      mileage,
      price,
      bodyType,
      fuel,
      transmission,
      engine,
      description,
      status,
      featured,
      tags,
      specs
    } = req.body;

    const uploadedImages = [];

    // Process uploaded image files if any
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const result = await uploadToCloudinary(file.buffer, 'boo-automotive/cars');
        uploadedImages.push({
          url: result.url,
          publicId: result.publicId,
          isMain: i === 0
        });
      }
    } else if (req.body.imageUrls) {
      // Direct URLs fallback
      const urls = Array.isArray(req.body.imageUrls) ? req.body.imageUrls : [req.body.imageUrls];
      urls.forEach((url, i) => {
        uploadedImages.push({
          url,
          publicId: '',
          isMain: i === 0
        });
      });
    }

    const parsedSpecs = typeof specs === 'string' ? JSON.parse(specs) : specs || [];
    const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags || [];

    const car = await Car.create({
      brand,
      model,
      year: Number(year),
      mileage: mileage || 'Zero km',
      price: Number(price),
      bodyType: bodyType || 'Sedan',
      fuel: fuel || 'Petrol',
      transmission: transmission || 'Automatic',
      engine: engine || '',
      description: description || '',
      status: status || 'Available',
      featured: featured === 'true' || featured === true,
      tags: parsedTags,
      specs: parsedSpecs,
      images: uploadedImages
    });

    return sendSuccess(res, car, 'Vehicle added successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update vehicle
// @route   PUT /api/cars/:id
// @access  Private (Admin)
export const updateCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return sendError(res, 'Vehicle not found', 404);
    }

    // Process new images if uploaded
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, 'boo-automotive/cars');
        car.images.push({
          url: result.url,
          publicId: result.publicId,
          isMain: car.images.length === 0
        });
      }
    }

    const fields = [
      'brand',
      'model',
      'year',
      'mileage',
      'price',
      'bodyType',
      'fuel',
      'transmission',
      'engine',
      'description',
      'status',
      'featured'
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        car[field] = req.body[field];
      }
    });

    if (req.body.specs) {
      car.specs = typeof req.body.specs === 'string' ? JSON.parse(req.body.specs) : req.body.specs;
    }

    if (req.body.tags) {
      car.tags = typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags;
    }

    await car.save();
    return sendSuccess(res, car, 'Vehicle updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete vehicle & clean up Cloudinary assets
// @route   DELETE /api/cars/:id
// @access  Private (Admin)
export const deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return sendError(res, 'Vehicle not found', 404);
    }

    // Remove images from Cloudinary
    for (const img of car.images) {
      if (img.publicId) {
        await deleteFromCloudinary(img.publicId);
      }
    }

    await car.deleteOne();
    return sendSuccess(res, { id: req.params.id }, 'Vehicle deleted successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete single image from vehicle
// @route   DELETE /api/cars/:id/images/:imageId
// @access  Private (Admin)
export const deleteCarImage = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return sendError(res, 'Vehicle not found', 404);

    const image = car.images.id(req.params.imageId);
    if (!image) return sendError(res, 'Image not found', 404);

    if (image.publicId) {
      await deleteFromCloudinary(image.publicId);
    }

    car.images.pull(req.params.imageId);
    await car.save();

    return sendSuccess(res, car, 'Image deleted successfully');
  } catch (error) {
    next(error);
  }
};
