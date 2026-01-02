/**
 * Centralized Error Handling Middleware
 *
 * Express error handlers have a 4-arg signature: (err, req, res, next).
 * Controllers call `next(error)` to route errors here. We translate common
 * errors (Mongoose CastError, duplicate key, validation) into user-friendly
 * HTTP responses. In development we include the stack trace to aid debugging.
 *
 * This complements process-level handlers in `server.js` for uncaught
 * exceptions and unhandled promise rejections.
 */
const errorMiddleware = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Invalid ID format';
    error = { message, statusCode: 400 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // JSON parsing error (bad request body)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    error = { message: 'Invalid JSON format', statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorMiddleware;