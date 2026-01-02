const express = require('express');
const {
  getDashboardOverview,
  getInventoryAnalytics,
  getSalesAnalytics,
  getAlerts
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const { 
  requireActiveAccount,
  requireAdminOrManager 
} = require('../middleware/roleMiddleware');
const { apiRateLimits } = require('../middleware/rateLimitMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);
router.use(requireActiveAccount);

// GET /api/dashboard/overview - Get dashboard overview
router.get('/overview', getDashboardOverview);

// GET /api/dashboard/inventory - Get inventory analytics
router.get('/inventory', getInventoryAnalytics);

// GET /api/dashboard/sales - Get sales analytics (Admin/Manager only)
router.get('/sales', requireAdminOrManager, getSalesAnalytics);

// GET /api/dashboard/alerts - Get alerts and notifications
router.get('/alerts', getAlerts);

module.exports = router;