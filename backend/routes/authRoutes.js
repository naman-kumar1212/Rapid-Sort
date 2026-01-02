/**
 * Auth Routes
 *
 * Shows public vs protected routes and middleware composition in Express.
 * - Public endpoints: register/login (with rate limiting and validation)
 * - Protected endpoints: require JWT auth (`protect`) and active account check
 * - Demonstrates chaining of middleware before controllers
 * Uses CommonJS exports via module.exports at the bottom.
 */
const express = require('express');
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { userValidation } = require('../middleware/validationMiddleware');
const { authRateLimit } = require('../middleware/rateLimitMiddleware');
const { requireActiveAccount } = require('../middleware/roleMiddleware');
const zeroTrustMiddleware = require('../middleware/zeroTrustMiddleware');

const router = express.Router();

// Public routes
router.post('/register', authRateLimit, userValidation.register, register);
router.post('/login', authRateLimit, userValidation.login, login);

// Protected routes
router.use(protect); // All routes below this middleware are protected
router.use(requireActiveAccount); // Ensure user account is active
router.use(zeroTrustMiddleware.continuousVerification); // Continuous Zero-Trust verification

router.get('/me', getMe);
router.put('/profile', userValidation.updateProfile, updateProfile);
router.put('/change-password', userValidation.changePassword, changePassword);
router.post('/logout', logout);

module.exports = router;