import express from 'express';
import { loginAdmin, getAdminProfile, registerAdmin } from '../controllers/authController.js';
import { protectAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/me', protectAdmin, getAdminProfile);
router.post('/register', protectAdmin, registerAdmin);

export default router;
