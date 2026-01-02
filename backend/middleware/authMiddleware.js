/**
 * Authentication Middleware (JWT)
 *
 * Parses the Authorization header for a Bearer token, verifies it using
 * JWT, and attaches the current user document to `req.user`. Demonstrates
 * async/await with Mongoose and secure route guarding in Express.
 * Includes a simple role-based guard helper (`authorize`).
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  console.log('Auth middleware - checking authorization header');
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('Token extracted:', token ? 'Yes' : 'No');

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
      console.log('Token decoded successfully, user ID:', decoded.id);

      // Add user to request object
      req.user = await User.findById(decoded.id).select('-password');
      console.log('User found from token:', req.user ? req.user.email : 'No user found');

      if (!req.user) {
        console.log('No user found for decoded token ID:', decoded.id);
        return res.status(401).json({
          success: false,
          message: 'Access denied. No user found.'
        });
      }

      console.log('Auth middleware - user authenticated:', req.user.email);
      next();
    } catch (error) {
      console.error('Auth middleware error details:', {
        message: error.message,
        name: error.name,
        token: token ? 'Present' : 'Missing'
      });
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  } else {
    console.log('No authorization header or invalid format');
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};

// Middleware to check user roles (for future use)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };