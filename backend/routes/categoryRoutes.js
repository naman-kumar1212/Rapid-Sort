const express = require('express');
const {
  getCategories,
  getCategoryTree,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats
} = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');
const { 
  requireAdminOrManager,
  requireActiveAccount,
  checkPermission 
} = require('../middleware/roleMiddleware');
const { 
  categoryValidation, 
  paramValidation, 
  queryValidation 
} = require('../middleware/validationMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);
router.use(requireActiveAccount);

// GET /api/categories/stats - Get category statistics
router.get('/stats', requireAdminOrManager, getCategoryStats);

// GET /api/categories/tree - Get category tree structure
router.get('/tree', checkPermission('read', 'categories'), getCategoryTree);

// GET /api/categories - Get all categories
router.get('/', 
  checkPermission('read', 'categories'), 
  queryValidation.pagination, 
  getCategories
);

// POST /api/categories - Create category
router.post('/', 
  checkPermission('create', 'categories'), 
  categoryValidation.create, 
  createCategory
);

// GET /api/categories/:id - Get single category
router.get('/:id', 
  checkPermission('read', 'categories'), 
  paramValidation.mongoId, 
  getCategory
);

// PUT /api/categories/:id - Update category
router.put('/:id', 
  checkPermission('update', 'categories'), 
  paramValidation.mongoId, 
  categoryValidation.update, 
  updateCategory
);

// DELETE /api/categories/:id - Delete category
router.delete('/:id', 
  checkPermission('delete', 'categories'), 
  paramValidation.mongoId, 
  deleteCategory
);

module.exports = router;