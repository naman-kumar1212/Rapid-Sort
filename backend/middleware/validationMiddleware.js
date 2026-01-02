const { body, param, query } = require('express-validator');

// User validation rules
const userValidation = {
  register: [
    body('firstName')
      .trim()
      .notEmpty()
      .withMessage('First name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('First name must be between 2 and 50 characters'),
    
    body('lastName')
      .trim()
      .notEmpty()
      .withMessage('Last name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('Last name must be between 2 and 50 characters'),
    
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    
    body('role')
      .optional()
      .isIn(['admin', 'manager', 'employee'])
      .withMessage('Role must be admin, manager, or employee'),
    
    body('department')
      .optional()
      .isIn(['inventory', 'sales', 'purchasing', 'warehouse', 'management'])
      .withMessage('Invalid department'),
    
    body('phone')
      .optional()
      .matches(/^\+?[\d\s-()]+$/)
      .withMessage('Please provide a valid phone number')
  ],

  login: [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],

  updateProfile: [
    body('firstName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('First name must be between 2 and 50 characters'),
    
    body('lastName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Last name must be between 2 and 50 characters'),
    
    body('phone')
      .optional()
      .matches(/^\+?[\d\s-()]+$/)
      .withMessage('Please provide a valid phone number')
  ],

  changePassword: [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long')
  ]
};

// Product validation rules
const productValidation = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Product name is required')
      .isLength({ min: 2, max: 200 })
      .withMessage('Product name must be between 2 and 200 characters'),
    
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    
    body('quantity')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Quantity must be a non-negative integer'),
    
    body('category')
      .optional()
      .isMongoId()
      .withMessage('Invalid category ID'),
    
    body('supplier')
      .optional()
      .isMongoId()
      .withMessage('Invalid supplier ID'),
    
    body('sku')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('SKU cannot exceed 50 characters'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description cannot exceed 1000 characters'),
    
    body('minStockLevel')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Minimum stock level must be a non-negative integer'),
    
    body('maxStockLevel')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Maximum stock level must be a non-negative integer')
  ],

  update: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 200 })
      .withMessage('Product name must be between 2 and 200 characters'),
    
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    
    body('quantity')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Quantity must be a non-negative integer'),
    
    body('category')
      .optional()
      .isMongoId()
      .withMessage('Invalid category ID'),
    
    body('supplier')
      .optional()
      .isMongoId()
      .withMessage('Invalid supplier ID')
  ]
};

// Category validation rules
const categoryValidation = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Category name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Category name must be between 2 and 100 characters'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),
    
    body('parentCategory')
      .optional()
      .isMongoId()
      .withMessage('Invalid parent category ID'),
    
    body('sortOrder')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Sort order must be a non-negative integer')
  ],

  update: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Category name must be between 2 and 100 characters'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),
    
    body('parentCategory')
      .optional()
      .isMongoId()
      .withMessage('Invalid parent category ID')
  ]
};

// Supplier validation rules
const supplierValidation = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Supplier name is required')
      .isLength({ min: 2, max: 200 })
      .withMessage('Supplier name must be between 2 and 200 characters'),
    
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    
    body('phone')
      .trim()
      .matches(/^\+?[\d\s-()]+$/)
      .withMessage('Please provide a valid phone number'),
    
    body('address.street')
      .trim()
      .notEmpty()
      .withMessage('Street address is required'),
    
    body('address.city')
      .trim()
      .notEmpty()
      .withMessage('City is required'),
    
    body('address.state')
      .trim()
      .notEmpty()
      .withMessage('State is required'),
    
    body('address.zipCode')
      .trim()
      .notEmpty()
      .withMessage('Zip code is required'),
    
    body('website')
      .optional()
      .isURL()
      .withMessage('Please provide a valid website URL'),
    
    body('paymentTerms')
      .optional()
      .isIn(['net-15', 'net-30', 'net-45', 'net-60', 'cod', 'prepaid'])
      .withMessage('Invalid payment terms'),
    
    body('creditLimit')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Credit limit must be a non-negative number'),
    
    body('rating')
      .optional()
      .isFloat({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5')
  ]
};

// Order validation rules
const orderValidation = {
  create: [
    body('type')
      .isIn(['purchase', 'sale', 'transfer', 'adjustment'])
      .withMessage('Invalid order type'),
    
    body('supplier')
      .if(body('type').equals('purchase'))
      .isMongoId()
      .withMessage('Supplier is required for purchase orders'),
    
    body('items')
      .isArray({ min: 1 })
      .withMessage('At least one item is required'),
    
    body('items.*.product')
      .isMongoId()
      .withMessage('Invalid product ID'),
    
    body('items.*.quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be at least 1'),
    
    body('items.*.unitPrice')
      .isFloat({ min: 0 })
      .withMessage('Unit price must be a positive number'),
    
    body('taxRate')
      .optional()
      .isFloat({ min: 0, max: 1 })
      .withMessage('Tax rate must be between 0 and 1'),
    
    body('shippingCost')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Shipping cost must be a non-negative number'),
    
    body('discount')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Discount must be a non-negative number')
  ]
};

// Common parameter validations
const paramValidation = {
  mongoId: [
    param('id')
      .isMongoId()
      .withMessage('Invalid ID format')
  ]
};

// Query parameter validations
const queryValidation = {
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
  ]
};

module.exports = {
  userValidation,
  productValidation,
  categoryValidation,
  supplierValidation,
  orderValidation,
  paramValidation,
  queryValidation
};