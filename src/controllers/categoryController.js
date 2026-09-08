import Category from '../models/Category.js';
import SparePart from '../models/SparePart.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

// @desc    Get all categories with active product counts
// @route   GET /api/categories
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1, name: 1 }).lean();
    
    // Compute real product count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const productCount = await SparePart.countDocuments({
          $or: [{ category: cat._id }, { categorySlug: cat.slug }],
          isActive: true
        });
        return {
          ...cat,
          productCount
        };
      })
    );

    return sendSuccess(res, categoriesWithCount, 'Categories retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get category by ID or slug
// @route   GET /api/categories/:idOrSlug
export const getCategoryById = async (req, res, next) => {
  try {
    const isObjectId = req.params.idOrSlug.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: req.params.idOrSlug } : { slug: req.params.idOrSlug };

    const category = await Category.findOne(query);
    if (!category) return sendError(res, 'Category not found', 404);

    return sendSuccess(res, category, 'Category details retrieved');
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Admin)
export const createCategory = async (req, res, next) => {
  try {
    const { name, slug, description, icon, order, isActive } = req.body;

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    let imageObj = { url: '', publicId: '' };
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'boo-automotive/categories');
      imageObj = { url: result.url, publicId: result.publicId };
    }

    const category = await Category.create({
      name,
      slug: generatedSlug,
      description: description || '',
      icon: icon || 'Sparkles',
      order: Number(order) || 0,
      isActive: isActive === undefined ? true : isActive === 'true' || isActive === true,
      image: imageObj
    });

    return sendSuccess(res, category, 'Category created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin)
export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return sendError(res, 'Category not found', 404);

    if (req.file) {
      if (category.image?.publicId) {
        await deleteFromCloudinary(category.image.publicId);
      }
      const result = await uploadToCloudinary(req.file.buffer, 'boo-automotive/categories');
      category.image = { url: result.url, publicId: result.publicId };
    }

    if (req.body.name) category.name = req.body.name;
    if (req.body.slug) category.slug = req.body.slug;
    if (req.body.description !== undefined) category.description = req.body.description;
    if (req.body.icon) category.icon = req.body.icon;
    if (req.body.order !== undefined) category.order = Number(req.body.order);
    if (req.body.isActive !== undefined) category.isActive = req.body.isActive === 'true' || req.body.isActive === true;

    await category.save();
    return sendSuccess(res, category, 'Category updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return sendError(res, 'Category not found', 404);

    if (category.image?.publicId) {
      await deleteFromCloudinary(category.image.publicId);
    }

    await category.deleteOne();
    return sendSuccess(res, { id: req.params.id }, 'Category deleted successfully');
  } catch (error) {
    next(error);
  }
};
