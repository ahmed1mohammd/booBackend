import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser.js';
import { sendError } from '../utils/responseHandler.js';

export const protectAdmin = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendError(res, 'Not authorized. Please log in to access this admin route.', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'boo_automotive_super_secure_jwt_secret_key_2026_x99');

    const admin = await AdminUser.findById(decoded.id).select('-password');
    if (!admin || !admin.isActive) {
      return sendError(res, 'Admin user not found or has been deactivated.', 401);
    }

    req.admin = admin;
    next();
  } catch (error) {
    return sendError(res, 'Token is invalid or has expired.', 401, error.message);
  }
};
