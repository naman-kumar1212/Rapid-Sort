/**
 * Settings Routes
 *
 * Protected routes that demonstrate:
 * - File uploads with multer using disk storage (avatar uploads to /uploads)
 * - Input validation with express-validator
 * - Async handlers with try/catch error responses
 * - Using middleware composition (protect, requireActiveAccount)
 * Uses CommonJS router export.
 */
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/authMiddleware');
const { requireActiveAccount } = require('../middleware/roleMiddleware');
const { validationResult, body } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/avatars';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// All routes are protected
router.use(protect);
router.use(requireActiveAccount);

// @desc    Get user profile settings
// @route   GET /api/settings/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/settings/profile
// @access  Private
const updateProfile = [
  body('firstName').optional().trim().isLength({ min: 2, max: 50 }),
  body('lastName').optional().trim().isLength({ min: 2, max: 50 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().matches(/^\+?[\d\s-()]+$/),
  body('position').optional().trim().isLength({ max: 100 }),
  body('company').optional().trim().isLength({ max: 100 }),
  
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { firstName, lastName, email, phone, position, company } = req.body;

      // Check if email is being changed and if it already exists
      if (email && email !== req.user.email) {
        const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: 'Email already exists'
          });
        }
      }

      const updateData = {};
      if (firstName) updateData.firstName = firstName;
      if (lastName) updateData.lastName = lastName;
      if (email) updateData.email = email;
      if (phone) updateData.phone = phone;
      if (position) updateData.position = position;
      if (company) updateData.company = company;

      const user = await User.findByIdAndUpdate(
        req.user.id,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while updating profile',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
];

// @desc    Upload avatar
// @route   POST /api/settings/avatar
// @access  Private
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    // Delete old avatar if exists
    const user = await User.findById(req.user.id);
    if (user.avatar && user.avatar !== avatarUrl) {
      const oldAvatarPath = path.join(__dirname, '..', user.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // Update user avatar
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: avatarUrl },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        avatar: avatarUrl,
        user: updatedUser
      }
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading avatar',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Change password
// @route   PUT /api/settings/password
// @access  Private
const changePassword = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { currentPassword, newPassword } = req.body;

      // Get user with password
      const user = await User.findById(req.user.id).select('+password');
      
      // Check current password
      const isCurrentPasswordCorrect = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordCorrect) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      await User.findByIdAndUpdate(req.user.id, { password: hashedPassword });

      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while changing password',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
];

// @desc    Get user preferences
// @route   GET /api/settings/preferences
// @access  Private
const getPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('preferences');
    
    const defaultPreferences = {
      notifications: {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        orderAlerts: true,
        lowStockAlerts: true,
        customerAlerts: false
      },
      appearance: {
        darkMode: false,
        language: 'en',
        timezone: 'UTC-5',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY'
      },
      system: {
        autoBackup: true,
        sessionTimeout: 30
      }
    };

    const preferences = user.preferences || defaultPreferences;

    res.status(200).json({
      success: true,
      data: preferences
    });
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching preferences',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update user preferences
// @route   PUT /api/settings/preferences
// @access  Private
const updatePreferences = async (req, res) => {
  try {
    const { notifications, appearance, system } = req.body;

    const user = await User.findById(req.user.id);
    
    if (!user.preferences) {
      user.preferences = {};
    }

    if (notifications) {
      user.preferences.notifications = { ...user.preferences.notifications, ...notifications };
    }
    
    if (appearance) {
      user.preferences.appearance = { ...user.preferences.appearance, ...appearance };
    }
    
    if (system) {
      user.preferences.system = { ...user.preferences.system, ...system };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: user.preferences
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating preferences',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Export user data
// @route   GET /api/settings/export
// @access  Private
const exportData = async (req, res) => {
  try {
    const { format = 'json' } = req.query;

    const user = await User.findById(req.user.id).select('-password');
    
    // In a real application, you would gather all user-related data
    const userData = {
      profile: user,
      exportDate: new Date().toISOString(),
      dataTypes: ['profile', 'preferences', 'activity_logs']
    };

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=user-data.json');
      return res.json(userData);
    }

    if (format === 'csv') {
      const csvData = `Name,Email,Role,Department,Created At\n${user.firstName} ${user.lastName},${user.email},${user.role},${user.department},${user.createdAt}`;
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=user-data.csv');
      return res.send(csvData);
    }

    res.status(400).json({
      success: false,
      message: 'Unsupported export format'
    });
  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while exporting data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/settings/account
// @access  Private
const deleteAccount = [
  body('password').notEmpty().withMessage('Password is required for account deletion'),
  
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { password } = req.body;

      // Get user with password
      const user = await User.findById(req.user.id).select('+password');
      
      // Verify password
      const isPasswordCorrect = await user.comparePassword(password);
      if (!isPasswordCorrect) {
        return res.status(400).json({
          success: false,
          message: 'Password is incorrect'
        });
      }

      // Don't actually delete admin users
      if (user.role === 'admin') {
        return res.status(400).json({
          success: false,
          message: 'Admin accounts cannot be deleted'
        });
      }

      // Soft delete - deactivate account
      await User.findByIdAndUpdate(req.user.id, { 
        isActive: false,
        email: `deleted_${Date.now()}_${user.email}` // Prevent email conflicts
      });

      res.status(200).json({
        success: true,
        message: 'Account deactivated successfully'
      });
    } catch (error) {
      console.error('Delete account error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while deleting account',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
];

// Routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/avatar', upload.single('avatar'), uploadAvatar);
router.put('/password', changePassword);
router.get('/preferences', getPreferences);
router.put('/preferences', updatePreferences);
router.get('/export', exportData);
router.delete('/account', deleteAccount);

module.exports = router;