import Accessory from '../models/Accessory.js';
import Category from '../models/Category.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

// @desc    Get all accessories (Public & Admin with filters)
// @route   GET /api/accessories
export const getAccessories = async (req, res, next) => {
  try {
    const {
      category,
      brand,
      search,
      inStock,
      lowStock,
      featured,
      sort,
      page = 1,
      limit = 20
    } = req.query;

    const andConditions = [];

    // Admin: see all accessories; Public: only active ones
    if (!req.admin) {
      andConditions.push({ isActive: { $ne: false } });
    }

    if (category && category !== 'all') {
      const catOrConditions = [
        { categorySlug: category },
        { categorySlug: new RegExp(`^${category}`, 'i') }
      ];
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        catOrConditions.push({ category });
      }
      andConditions.push({ $or: catOrConditions });
    }

    if (brand && brand !== 'All') {
      andConditions.push({ brand: { $regex: brand, $options: 'i' } });
    }

    if (inStock === 'true') {
      andConditions.push({ stock: { $gt: 0 } });
    }

    if (lowStock === 'true') {
      andConditions.push({ $expr: { $lte: ['$stock', '$minimumStock'] } });
    }

    if (featured === 'true') {
      andConditions.push({ featured: true });
    }

    if (search && search.trim()) {
      const s = search.trim();
      andConditions.push({
        $or: [
          { name: { $regex: s, $options: 'i' } },
          { sku: { $regex: s, $options: 'i' } },
          { brand: { $regex: s, $options: 'i' } },
          { shortDescription: { $regex: s, $options: 'i' } },
          { description: { $regex: s, $options: 'i' } },
          { compatibility: { $in: [new RegExp(s, 'i')] } }
        ]
      });
    }

    const query = andConditions.length > 0 ? { $and: andConditions } : {};

    let sortOption = { createdAt: -1 };
    if (sort === 'price-low') sortOption = { price: 1 };
    if (sort === 'price-high') sortOption = { price: -1 };
    if (sort === 'name') sortOption = { name: 1 };
    if (sort === 'stock') sortOption = { stock: 1 };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [accessories, total] = await Promise.all([
      Accessory.find(query)
        .populate('category', 'name slug')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Accessory.countDocuments(query)
    ]);

    return sendSuccess(
      res,
      accessories,
      'Accessories retrieved successfully',
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

// @desc    Get single accessory by ID or SKU
// @route   GET /api/accessories/:idOrSku
export const getAccessoryById = async (req, res, next) => {
  try {
    const isObjectId = req.params.idOrSku.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId
      ? { _id: req.params.idOrSku }
      : { sku: req.params.idOrSku.toUpperCase() };

    const accessory = await Accessory.findOne(query).populate('category', 'name slug');
    if (!accessory) return sendError(res, 'Accessory not found', 404);

    // Get related accessories in same category
    const related = await Accessory.find({
      categorySlug: accessory.categorySlug,
      _id: { $ne: accessory._id },
      isActive: true
    }).limit(3);

    return sendSuccess(res, { product: accessory, related }, 'Accessory details retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Create new accessory
// @route   POST /api/accessories
// @access  Private (Admin)
export const createAccessory = async (req, res, next) => {
  try {
    const {
      name,
      sku,
      category,
      categorySlug,
      brand,
      price,
      description,
      shortDescription,
      stock,
      minimumStock,
      compatibility,
      isActive,
      featured
    } = req.body;

    const existing = await Accessory.findOne({ sku: sku.toUpperCase().trim() });
    if (existing) {
      return sendError(res, `An accessory with SKU "${sku}" already exists.`, 400);
    }

    const uploadedImages = [];

    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const result = await uploadToCloudinary(file.buffer, 'boo-automotive/accessories');
        uploadedImages.push({
          url: result.url,
          publicId: result.publicId,
          isMain: i === 0
        });
      }
    } else if (req.body.imageUrls) {
      const urls = Array.isArray(req.body.imageUrls) ? req.body.imageUrls : [req.body.imageUrls];
      urls.forEach((url, i) => {
        uploadedImages.push({ url, publicId: '', isMain: i === 0 });
      });
    }

    let finalCategorySlug = categorySlug || 'accessories';
    if (category && category.match(/^[0-9a-fA-F]{24}$/)) {
      const catDoc = await Category.findById(category);
      if (catDoc) finalCategorySlug = catDoc.slug;
    }

    const parsedCompat =
      typeof compatibility === 'string' ? JSON.parse(compatibility) : compatibility || [];

    const accessory = await Accessory.create({
      name,
      sku: sku.toUpperCase().trim(),
      category: category && category.match(/^[0-9a-fA-F]{24}$/) ? category : undefined,
      categorySlug: finalCategorySlug,
      brand,
      price: Number(price),
      description: description || '',
      shortDescription: shortDescription || '',
      images: uploadedImages,
      stock: Number(stock) || 0,
      minimumStock: Number(minimumStock) || 3,
      compatibility: parsedCompat,
      isActive: isActive === undefined ? true : isActive === 'true' || isActive === true,
      featured: featured === 'true' || featured === true
    });

    return sendSuccess(res, accessory, 'Accessory created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update accessory
// @route   PUT /api/accessories/:idOrSku
// @access  Private (Admin)
export const updateAccessory = async (req, res, next) => {
  try {
    const id = req.params.id || req.params.idOrSku;
    const isObjectId = id && id.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: id } : { sku: id.toUpperCase() };

    const accessory = await Accessory.findOne(query);
    if (!accessory) return sendError(res, 'Accessory not found', 404);

    if (req.body.sku && req.body.sku.toUpperCase() !== accessory.sku) {
      const existing = await Accessory.findOne({ sku: req.body.sku.toUpperCase() });
      if (existing) {
        return sendError(res, `SKU "${req.body.sku}" is already in use by another accessory.`, 400);
      }
      accessory.sku = req.body.sku.toUpperCase();
    }

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, 'boo-automotive/accessories');
        accessory.images.push({
          url: result.url,
          publicId: result.publicId,
          isMain: accessory.images.length === 0
        });
      }
    }

    const fields = [
      'name',
      'brand',
      'price',
      'description',
      'shortDescription',
      'stock',
      'minimumStock',
      'isActive',
      'featured',
      'categorySlug'
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        accessory[field] = req.body[field];
      }
    });

    if (req.body.category && req.body.category.match(/^[0-9a-fA-F]{24}$/)) {
      accessory.category = req.body.category;
      const catDoc = await Category.findById(req.body.category);
      if (catDoc) accessory.categorySlug = catDoc.slug;
    }

    if (req.body.compatibility) {
      accessory.compatibility =
        typeof req.body.compatibility === 'string'
          ? JSON.parse(req.body.compatibility)
          : req.body.compatibility;
    }

    await accessory.save();
    return sendSuccess(res, accessory, 'Accessory updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete accessory & Cloudinary images
// @route   DELETE /api/accessories/:idOrSku
// @access  Private (Admin)
export const deleteAccessory = async (req, res, next) => {
  try {
    const id = req.params.id || req.params.idOrSku;
    const isObjectId = id && id.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: id } : { sku: id.toUpperCase() };

    const accessory = await Accessory.findOne(query);
    if (!accessory) return sendError(res, 'Accessory not found', 404);

    for (const img of accessory.images) {
      if (img.publicId) {
        await deleteFromCloudinary(img.publicId);
      }
    }

    await accessory.deleteOne();
    return sendSuccess(res, { id: accessory._id }, 'Accessory deleted successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete single image from accessory
// @route   DELETE /api/accessories/:id/images/:imageId
// @access  Private (Admin)
export const deleteAccessoryImage = async (req, res, next) => {
  try {
    const accessory = await Accessory.findById(req.params.id);
    if (!accessory) return sendError(res, 'Accessory not found', 404);

    const image = accessory.images.id(req.params.imageId);
    if (!image) return sendError(res, 'Image not found', 404);

    if (image.publicId) {
      await deleteFromCloudinary(image.publicId);
    }

    accessory.images.pull(req.params.imageId);
    await accessory.save();

    return sendSuccess(res, accessory, 'Image deleted successfully');
  } catch (error) {
    next(error);
  }
};
