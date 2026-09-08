/**
 * Standardized JSON API Response Helpers
 * Format:
 * Success: { success: true, message: "...", data: {...}, pagination: {...} }
 * Error:   { success: false, message: "...", error: "..." }
 */

export const sendSuccess = (res, data = {}, message = 'Operation successful', statusCode = 200, pagination = null) => {
  const response = {
    success: true,
    message,
    data
  };

  if (pagination) {
    response.pagination = pagination;
  }

  return res.status(statusCode).json(response);
};

export const sendError = (res, message = 'An error occurred', statusCode = 500, error = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: error || message
  });
};
