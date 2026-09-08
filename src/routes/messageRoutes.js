import express from 'express';
import {
  createMessage,
  getMessages,
  updateMessageStatus,
  deleteMessage
} from '../controllers/messageController.js';
import { protectAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protectAdmin, getMessages)
  .post(createMessage);

router.route('/:id')
  .put(protectAdmin, updateMessageStatus)
  .delete(protectAdmin, deleteMessage);

export default router;
