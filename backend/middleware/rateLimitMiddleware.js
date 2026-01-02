const rateLimit = require('express-rate-limit');
const { getRateLimit } = require('./roleMiddleware');

// Basic rate limiting
const basicRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Strict rate limiting for authentication endpoints
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Increased limit to 20 requests per windowMs for auth endpoints
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Dynamic rate limiting based on user role
const dynamicRateLimit = (req, res, next) => {
  const limits = getRateLimit(req);
  
  const limiter = rateLimit({
    windowMs: limits.windowMs,
    max: limits.max,
    message: {
      success: false,
      message: `Too many requests. Limit: ${limits.max} requests per ${limits.windowMs / 60000} minutes.`,
      retryAfter: `${limits.windowMs / 60000} minutes`
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      // Use user ID if authenticated, otherwise use IP
      return req.user ? `user_${req.user.id}` : req.ip;
    }
  });
  
  return limiter(req, res, next);
};

// API-specific rate limits
const apiRateLimits = {
  // Products API
  products: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: {
      success: false,
      message: 'Too many product API requests, please try again later.'
    }
  }),
  
  // Orders API
  orders: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
      success: false,
      message: 'Too many order API requests, please try again later.'
    }
  }),
  
  // Reports API (more restrictive)
  reports: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
      success: false,
      message: 'Too many report requests, please try again later.'
    }
  }),
  
  // File upload
  upload: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
      success: false,
      message: 'Too many file upload requests, please try again later.'
    }
  })
};

// Create custom rate limiter
const createRateLimit = (options = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
      success: false,
      message: 'Too many requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
  };
  
  return rateLimit({ ...defaultOptions, ...options });
};

// Rate limit by user ID
const userRateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  return rateLimit({
    windowMs,
    max: maxRequests,
    keyGenerator: (req) => {
      return req.user ? `user_${req.user.id}` : req.ip;
    },
    message: {
      success: false,
      message: `Too many requests. Limit: ${maxRequests} requests per ${windowMs / 60000} minutes.`
    }
  });
};

// Skip rate limiting for certain conditions
const skipRateLimit = (req) => {
  // Skip for admin users
  if (req.user && req.user.role === 'admin') {
    return true;
  }
  
  // Skip for internal requests (if you have internal API keys)
  if (req.headers['x-internal-api-key'] === process.env.INTERNAL_API_KEY) {
    return true;
  }
  
  // Skip for health checks
  if (req.path === '/health' || req.path === '/api/health') {
    return true;
  }
  
  return false;
};

// Rate limit with skip function
const conditionalRateLimit = (options = {}) => {
  const limiter = createRateLimit(options);
  
  return (req, res, next) => {
    if (skipRateLimit(req)) {
      return next();
    }
    return limiter(req, res, next);
  };
};

module.exports = {
  basicRateLimit,
  authRateLimit,
  dynamicRateLimit,
  apiRateLimits,
  createRateLimit,
  userRateLimit,
  conditionalRateLimit,
  skipRateLimit
};