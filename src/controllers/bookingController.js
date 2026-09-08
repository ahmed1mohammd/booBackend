import MaintenanceBooking from '../models/MaintenanceBooking.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

// @desc    Create new service booking (Public)
// @route   POST /api/bookings
export const createBooking = async (req, res, next) => {
  try {
    const { customerName, customerPhone, carModel, serviceName, service, preferredDate, notes } = req.body;

    if (!customerName || !customerPhone || !carModel) {
      return sendError(res, 'Customer name, phone number, and vehicle model are required.', 400);
    }

    const bookingNum = `BK-${Math.floor(10000 + Math.random() * 90000)}`;

    const booking = await MaintenanceBooking.create({
      bookingNumber: bookingNum,
      customerName,
      customerPhone,
      carModel,
      serviceName: serviceName || 'Periodic Maintenance',
      service: service && service.match(/^[0-9a-fA-F]{24}$/) ? service : undefined,
      preferredDate: preferredDate || '',
      notes: notes || '',
      status: 'pending'
    });

    return sendSuccess(res, booking, 'Service appointment requested successfully. A BOO advisor will call you shortly.', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private (Admin)
export const getBookings = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { customerPhone: { $regex: search, $options: 'i' } },
        { carModel: { $regex: search, $options: 'i' } },
        { bookingNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [bookings, total] = await Promise.all([
      MaintenanceBooking.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      MaintenanceBooking.countDocuments(query)
    ]);

    return sendSuccess(res, bookings, 'Bookings retrieved', 200, {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      limit: limitNum
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status or notes (Admin)
// @route   PUT /api/bookings/:id
// @access  Private (Admin)
export const updateBookingStatus = async (req, res, next) => {
  try {
    const booking = await MaintenanceBooking.findById(req.params.id);
    if (!booking) return sendError(res, 'Booking not found', 404);

    if (req.body.status) booking.status = req.body.status;
    if (req.body.adminNotes !== undefined) booking.adminNotes = req.body.adminNotes;
    if (req.body.preferredDate) booking.preferredDate = req.body.preferredDate;

    await booking.save();
    return sendSuccess(res, booking, 'Booking updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete booking (Admin)
// @route   DELETE /api/bookings/:id
// @access  Private (Admin)
export const deleteBooking = async (req, res, next) => {
  try {
    const booking = await MaintenanceBooking.findById(req.params.id);
    if (!booking) return sendError(res, 'Booking not found', 404);

    await booking.deleteOne();
    return sendSuccess(res, { id: req.params.id }, 'Booking deleted successfully');
  } catch (error) {
    next(error);
  }
};
