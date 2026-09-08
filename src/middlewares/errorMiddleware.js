import { sendError } from '../utils/responseHandler.js';

export const errorHandler = (err, req, res, next) => {
  console.error('[Error Middleware]:', err);

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendError(res, `Duplicate field value entered for "${field}". Please use another value.`, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return sendError(res, messages.join(', '), 400);
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return sendError(res, `Resource not found with id of ${err.value}`, 404);
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return sendError(res, err.message || 'Internal Server Error', statusCode);
};

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
