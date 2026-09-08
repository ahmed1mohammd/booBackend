import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'boo_automotive_super_secure_jwt_secret_key_2026_x99',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @desc    Admin Login
// @route   POST /api/auth/login
// @access  Public
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Please provide both email and password.', 400);
    }

    const admin = await AdminUser.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return sendError(res, 'Invalid email or password.', 401);
    }

    if (!admin.isActive) {
      return sendError(res, 'Your account has been deactivated. Please contact the administrator.', 403);
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password.', 401);
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken(admin._id);

    return sendSuccess(
      res,
      {
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      },
      'Logged in successfully'
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get current admin profile
// @route   GET /api/auth/me
// @access  Private (Admin)
export const getAdminProfile = async (req, res, next) => {
  try {
    return sendSuccess(res, { admin: req.admin }, 'Profile fetched successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new admin (Superadmin only)
// @route   POST /api/auth/register
// @access  Private (Superadmin)
export const registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await AdminUser.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return sendError(res, 'An admin with this email already exists.', 400);
    }

    const newAdmin = await AdminUser.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      role: role || 'admin'
    });

    return sendSuccess(
      res,
      {
        admin: {
          id: newAdmin._id,
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role
        }
      },
      'Admin created successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};
