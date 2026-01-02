const express = require('express');
const Supplier = require('../models/Supplier');
const { protect } = require('../middleware/authMiddleware');
const { 
  requireActiveAccount,
  checkPermission 
} = require('../middleware/roleMiddleware');
const { 
  supplierValidation, 
  paramValidation, 
  queryValidation 
} = require('../middleware/validationMiddleware');
const { validationResult } = require('express-validator');

const router = express.Router();

// All routes are protected
router.use(protect);
router.use(requireActiveAccount);

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Private
const getSuppliers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    // Filter by active status
    if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === 'true';
    }
    
    // Search by name, company, or email
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { name: searchRegex },
        { companyName: searchRegex },
        { email: searchRegex }
      ];
    }
    
    // Filter by city or state
    if (req.query.city) {
      query['address.city'] = new RegExp(req.query.city, 'i');
    }
    if (req.query.state) {
      query['address.state'] = new RegExp(req.query.state, 'i');
    }

    // Get suppliers with pagination
    const suppliers = await Supplier.find(query)
      .populate('categories', 'name')
      .populate('createdBy', 'firstName lastName')
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);

    // Get total count
    const total = await Supplier.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      count: suppliers.length,
      total,
      page,
      totalPages,
      data: suppliers
    });
  } catch (error) {
    console.error('Get suppliers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching suppliers',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single supplier
// @route   GET /api/suppliers/:id
// @access  Private
const getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id)
      .populate('categories', 'name slug')
      .populate('createdBy', 'firstName lastName');
    
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    res.status(200).json({
      success: true,
      data: supplier
    });
  } catch (error) {
    console.error('Get supplier error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching supplier',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create supplier
// @route   POST /api/suppliers
// @access  Private
const createSupplier = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const supplierData = {
      ...req.body,
      createdBy: req.user.id
    };

    // Check if supplier email already exists
    const existingSupplier = await Supplier.findOne({ email: req.body.email });
    if (existingSupplier) {
      return res.status(400).json({
        success: false,
        message: 'Supplier with this email already exists'
      });
    }

    const supplier = await Supplier.create(supplierData);

    // Populate the created supplier
    await supplier.populate('createdBy', 'firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Supplier created successfully',
      data: supplier
    });
  } catch (error) {
    console.error('Create supplier error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating supplier',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update supplier
// @route   PUT /api/suppliers/:id
// @access  Private
const updateSupplier = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email is being changed and if it already exists
    if (email) {
      const existingSupplier = await Supplier.findOne({ 
        email, 
        _id: { $ne: req.params.id } 
      });
      
      if (existingSupplier) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('createdBy', 'firstName lastName');

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Supplier updated successfully',
      data: supplier
    });
  } catch (error) {
    console.error('Update supplier error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating supplier',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete supplier
// @route   DELETE /api/suppliers/:id
// @access  Private
const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    // Check if supplier has products
    const Product = require('../models/Product');
    const productCount = await Product.countDocuments({ supplier: req.params.id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete supplier. It has ${productCount} products assigned to it.`
      });
    }

    await Supplier.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Supplier deleted successfully'
    });
  } catch (error) {
    console.error('Delete supplier error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting supplier',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get supplier statistics
// @route   GET /api/suppliers/stats
// @access  Private
const getSupplierStats = async (req, res) => {
  try {
    const stats = await Supplier.aggregate([
      {
        $group: {
          _id: null,
          totalSuppliers: { $sum: 1 },
          activeSuppliers: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          },
          averageRating: { $avg: '$rating' },
          totalCreditLimit: { $sum: '$creditLimit' },
          totalBalance: { $sum: '$currentBalance' }
        }
      }
    ]);

    // Get suppliers by state
    const byState = await Supplier.aggregate([
      {
        $group: {
          _id: '$address.state',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get top suppliers by total spent
    const topSuppliers = await Supplier.find()
      .select('name companyName totalSpent totalOrders')
      .sort({ totalSpent: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || { 
          totalSuppliers: 0, 
          activeSuppliers: 0, 
          averageRating: 0,
          totalCreditLimit: 0,
          totalBalance: 0
        },
        byState,
        topSuppliers
      }
    });
  } catch (error) {
    console.error('Get supplier stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching supplier statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Routes
router.get('/stats', checkPermission('read', 'suppliers'), getSupplierStats);
router.get('/', checkPermission('read', 'suppliers'), queryValidation.pagination, getSuppliers);
router.post('/', checkPermission('create', 'suppliers'), supplierValidation.create, createSupplier);
router.get('/:id', checkPermission('read', 'suppliers'), paramValidation.mongoId, getSupplier);
router.put('/:id', checkPermission('update', 'suppliers'), paramValidation.mongoId, updateSupplier);
router.delete('/:id', checkPermission('delete', 'suppliers'), paramValidation.mongoId, deleteSupplier);

module.exports = router;