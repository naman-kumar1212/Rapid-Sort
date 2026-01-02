const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { 
  requireAdmin, 
  requireAdminOrManager,
  requireActiveAccount 
} = require('../middleware/roleMiddleware');
const { 
  userValidation, 
  paramValidation, 
  queryValidation 
} = require('../middleware/validationMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);
router.use(requireActiveAccount);

// GET /api/users/stats - Get user statistics (Admin/Manager only)
router.get('/stats', requireAdminOrManager, getUserStats);

// GET /api/users - Get all users (Admin/Manager only)
router.get('/', requireAdminOrManager, queryValidation.pagination, getUsers);

// POST /api/users - Create user (Admin only)
router.post('/', requireAdmin, userValidation.register, createUser);

// GET /api/users/:id - Get single user (Admin/Manager only)
router.get('/:id', requireAdminOrManager, paramValidation.mongoId, getUser);

// PUT /api/users/:id - Update user (Admin/Manager only)
router.put('/:id', requireAdminOrManager, paramValidation.mongoId, updateUser);

// DELETE /api/users/:id - Delete user (Admin only)
router.delete('/:id', requireAdmin, paramValidation.mongoId, deleteUser);

module.exports = router;