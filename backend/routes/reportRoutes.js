const express = require('express');
const {
  getInventoryReport,
  getSalesReport,
  getStockMovementReport,
  getSupplierPerformanceReport,
  getCustomerReport,
  getSupplierReport
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { 
  requireActiveAccount,
  requireAdminOrManager,
  checkPermission 
} = require('../middleware/roleMiddleware');
const { apiRateLimits } = require('../middleware/rateLimitMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);
router.use(requireActiveAccount);
router.use(apiRateLimits.reports); // Apply stricter rate limiting for reports

// GET /api/reports/inventory - Generate inventory report
router.get('/inventory', 
  checkPermission('read', 'reports'), 
  getInventoryReport
);

// GET /api/reports/sales - Generate sales report (Admin/Manager only)
router.get('/sales', 
  requireAdminOrManager, 
  getSalesReport
);

// GET /api/reports/stock-movements - Generate stock movement report
router.get('/stock-movements', 
  checkPermission('read', 'reports'), 
  getStockMovementReport
);

// GET /api/reports/supplier-performance - Generate supplier performance report (Admin/Manager only)
router.get('/supplier-performance', 
  requireAdminOrManager, 
  getSupplierPerformanceReport
);

// GET /api/reports/customers - Generate customer report
router.get('/customers', 
  checkPermission('read', 'reports'), 
  getCustomerReport
);

// GET /api/reports/suppliers - Generate supplier report
router.get('/suppliers', 
  checkPermission('read', 'reports'), 
  getSupplierReport
);

module.exports = router;