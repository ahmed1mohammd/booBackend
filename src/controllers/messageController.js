import ContactMessage from '../models/ContactMessage.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

// @desc    Submit contact message / inquiry (Public)
// @route   POST /api/messages
export const createMessage = async (req, res, next) => {
  try {
    const { name, phone, email, subject, message } = req.body;

    if (!name || !phone || !message) {
      return sendError(res, 'Name, phone number, and message are required.', 400);
    }

    const newMessage = await ContactMessage.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : '',
      subject: subject || 'General Inquiry',
      message: message.trim(),
      status: 'unread'
    });

    return sendSuccess(res, newMessage, 'Message sent successfully. Our team will contact you soon.', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all messages with filter & pagination (Admin)
// @route   GET /api/messages
// @access  Private (Admin)
export const getMessages = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [messages, total, unreadCount] = await Promise.all([
      ContactMessage.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      ContactMessage.countDocuments(query),
      ContactMessage.countDocuments({ status: 'unread' })
    ]);

    return sendSuccess(res, messages, 'Messages retrieved', 200, {
      total,
      unreadCount,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      limit: limitNum
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update message status or admin notes (Admin)
// @route   PUT /api/messages/:id
// @access  Private (Admin)
export const updateMessageStatus = async (req, res, next) => {
  try {
    const msg = await ContactMessage.findById(req.params.id);
    if (!msg) return sendError(res, 'Message not found', 404);

    if (req.body.status) msg.status = req.body.status;
    if (req.body.adminNotes !== undefined) msg.adminNotes = req.body.adminNotes;

    await msg.save();
    return sendSuccess(res, msg, 'Message updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete message (Admin)
// @route   DELETE /api/messages/:id
// @access  Private (Admin)
export const deleteMessage = async (req, res, next) => {
  try {
    const msg = await ContactMessage.findById(req.params.id);
    if (!msg) return sendError(res, 'Message not found', 404);

    await msg.deleteOne();
    return sendSuccess(res, { id: req.params.id }, 'Message deleted successfully');
  } catch (error) {
    next(error);
  }
};
