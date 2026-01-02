const express = require('express');
const { body } = require('express-validator');
const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  syncCustomerStats,
  syncAllCustomerStats,
  getCustomerAnalytics
} = require('../controllers/customerController');
const { protect } = require('../middleware/authMiddleware');
const { 
  requireActiveAccount,
  requireAdminOrManager,
  checkPermission 
} = require('../middleware/roleMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);
router.use(requireActiveAccount);

// Validation rules
const customerValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name is required and must be between 1-50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name is required and must be between 1-50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('customerType')
    .optional()
    .isIn(['individual', 'business'])
    .withMessage('Customer type must be either individual or business'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'suspended'])
    .withMessage('Status must be active, inactive, or suspended'),
  body('creditLimit')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Credit limit must be a positive number'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
];

// GET /api/customers - Get all customers
router.get('/', checkPermission('read', 'customers'), getCustomers);

// GET /api/customers/analytics - Get customer analytics (Admin/Manager only)
router.get('/analytics', requireAdminOrManager, getCustomerAnalytics);

// POST /api/customers/sync-all-stats - Sync all customer stats (Admin only)
router.post('/sync-all-stats', requireAdminOrManager, syncAllCustomerStats);

// GET /api/customers/:id - Get single customer
router.get('/:id', checkPermission('read', 'customers'), getCustomerById);

// POST /api/customers - Create new customer
router.post('/', 
  checkPermission('create', 'customers'),
  customerValidation,
  createCustomer
);

// PUT /api/customers/:id - Update customer
router.put('/:id',
  checkPermission('update', 'customers'),
  customerValidation,
  updateCustomer
);

// DELETE /api/customers/:id - Delete customer
router.delete('/:id', 
  checkPermission('delete', 'customers'),
  deleteCustomer
);

// POST /api/customers/:id/sync-stats - Sync customer stats
router.post('/:id/sync-stats',
  checkPermission('update', 'customers'),
  syncCustomerStats
);

module.exports = router;