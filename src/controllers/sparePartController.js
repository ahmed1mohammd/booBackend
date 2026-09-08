import SparePart from '../models/SparePart.js';
import Category from '../models/Category.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

// @desc    Get all spare parts (Public & Admin with filters)
// @route   GET /api/products
export const getSpareParts = async (req, res, next) => {
  try {
    const {
      category,
      brand,
      search,
      inStock,
      lowStock,
      sort,
      page = 1,
      limit = 20
    } = req.query;

    const andConditions = [];

    // For public website show only active parts unless admin
    if (!req.admin) {
      andConditions.push({ isActive: true });
    }

    if (category && category !== 'all') {
      const catOrConditions = [
        { categorySlug: category },
        { categorySlug: new RegExp(`^${category}`, 'i') }
      ];
      if (category.toLowerCase().includes('brake') || category === 'فرامل') {
        catOrConditions.push({ categorySlug: 'brake' }, { categorySlug: 'brakes' });
      }
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

    if (search && search.trim()) {
      const s = search.trim();
      andConditions.push({
        $or: [
          { name: { $regex: s, $options: 'i' } },
          { sku: { $regex: s, $options: 'i' } },
          { brand: { $regex: s, $options: 'i' } },
          { model: { $regex: s, $options: 'i' } },
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

    const [parts, total] = await Promise.all([
      SparePart.find(query).populate('category', 'name slug').sort(sortOption).skip(skip).limit(limitNum),
      SparePart.countDocuments(query)
    ]);

    return sendSuccess(
      res,
      parts,
      'Spare parts retrieved successfully',
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

// @desc    Get single spare part by ID or SKU
// @route   GET /api/products/:idOrSku
export const getSparePartById = async (req, res, next) => {
  try {
    const isObjectId = req.params.idOrSku.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: req.params.idOrSku } : { sku: req.params.idOrSku.toUpperCase() };

    const part = await SparePart.findOne(query).populate('category', 'name slug');
    if (!part) return sendError(res, 'Spare part not found', 404);

    // Get related parts in same category
    const related = await SparePart.find({
      categorySlug: part.categorySlug,
      _id: { $ne: part._id },
      isActive: true
    }).limit(3);

    return sendSuccess(res, { product: part, related }, 'Product details retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Create new spare part
// @route   POST /api/products
// @access  Private (Admin)
export const createSparePart = async (req, res, next) => {
  try {
    const {
      name,
      sku,
      category,
      categorySlug,
      brand,
      model,
      price,
      stock,
      minimumStock,
      shortDescription,
      description,
      specs,
      compatibility,
      isActive,
      featured
    } = req.body;

    const existing = await SparePart.findOne({ sku: sku.toUpperCase().trim() });
    if (existing) {
      return sendError(res, `A spare part with SKU "${sku}" already exists.`, 400);
    }

    const uploadedImages = [];

    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const result = await uploadToCloudinary(file.buffer, 'boo-automotive/parts');
        uploadedImages.push({
          url: result.url,
          publicId: result.publicId,
          isMain: i === 0
        });
      }
    } else if (req.body.imageUrls) {
      const urls = Array.isArray(req.body.imageUrls) ? req.body.imageUrls : [req.body.imageUrls];
      urls.forEach((url, i) => {
        uploadedImages.push({
          url,
          publicId: '',
          isMain: i === 0
        });
      });
    }

    let finalCategorySlug = categorySlug || 'all';
    if (category && category.match(/^[0-9a-fA-F]{24}$/)) {
      const catDoc = await Category.findById(category);
      if (catDoc) finalCategorySlug = catDoc.slug;
    }

    const parsedSpecs = typeof specs === 'string' ? JSON.parse(specs) : specs || [];
    const parsedCompat = typeof compatibility === 'string' ? JSON.parse(compatibility) : compatibility || [];

    const part = await SparePart.create({
      name,
      sku: sku.toUpperCase().trim(),
      category: category && category.match(/^[0-9a-fA-F]{24}$/) ? category : undefined,
      categorySlug: finalCategorySlug,
      brand,
      model: model || '',
      price: Number(price),
      stock: Number(stock) || 0,
      minimumStock: Number(minimumStock) || 3,
      shortDescription: shortDescription || '',
      description: description || '',
      images: uploadedImages,
      specs: parsedSpecs,
      compatibility: parsedCompat,
      isActive: isActive === undefined ? true : isActive === 'true' || isActive === true,
      featured: featured === 'true' || featured === true
    });

    return sendSuccess(res, part, 'Spare part created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update spare part
// @route   PUT /api/products/:idOrSku
// @access  Private (Admin)
export const updateSparePart = async (req, res, next) => {
  try {
    const id = req.params.id || req.params.idOrSku;
    const isObjectId = id && id.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: id } : { sku: id.toUpperCase() };

    const part = await SparePart.findOne(query);
    if (!part) return sendError(res, 'Spare part not found', 404);

    if (req.body.sku && req.body.sku.toUpperCase() !== part.sku) {
      const existing = await SparePart.findOne({ sku: req.body.sku.toUpperCase() });
      if (existing) {
        return sendError(res, `SKU "${req.body.sku}" is already in use by another part.`, 400);
      }
      part.sku = req.body.sku.toUpperCase();
    }

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, 'boo-automotive/parts');
        part.images.push({
          url: result.url,
          publicId: result.publicId,
          isMain: part.images.length === 0
        });
      }
    }

    const fields = [
      'name',
      'brand',
      'model',
      'price',
      'stock',
      'minimumStock',
      'shortDescription',
      'description',
      'isActive',
      'featured',
      'categorySlug'
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        part[field] = req.body[field];
      }
    });

    if (req.body.category && req.body.category.match(/^[0-9a-fA-F]{24}$/)) {
      part.category = req.body.category;
      const catDoc = await Category.findById(req.body.category);
      if (catDoc) part.categorySlug = catDoc.slug;
    }

    if (req.body.specs) {
      part.specs = typeof req.body.specs === 'string' ? JSON.parse(req.body.specs) : req.body.specs;
    }

    if (req.body.compatibility) {
      part.compatibility = typeof req.body.compatibility === 'string' ? JSON.parse(req.body.compatibility) : req.body.compatibility;
    }

    await part.save();
    return sendSuccess(res, part, 'Spare part updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete spare part & clean up Cloudinary images
// @route   DELETE /api/products/:idOrSku
// @access  Private (Admin)
export const deleteSparePart = async (req, res, next) => {
  try {
    const id = req.params.id || req.params.idOrSku;
    const isObjectId = id && id.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: id } : { sku: id.toUpperCase() };

    const part = await SparePart.findOne(query);
    if (!part) return sendError(res, 'Spare part not found', 404);

    for (const img of part.images) {
      if (img.publicId) {
        await deleteFromCloudinary(img.publicId);
      }
    }

    await part.deleteOne();
    return sendSuccess(res, { id: part._id }, 'Spare part deleted successfully');
  } catch (error) {
    next(error);
  }
};
