const Customer = require('../models/Customer');
const Order = require('../models/Order');
const { validationResult } = require('express-validator');

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
const getCustomers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      customerType,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = { isActive: true };

    // Search functionality
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by customer type
    if (customerType) {
      query.customerType = customerType;
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const customers = await Customer.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'firstName lastName')
      .populate('updatedBy', 'firstName lastName');

    // Get total count for pagination
    const total = await Customer.countDocuments(query);

    // Calculate statistics
    const stats = await Customer.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: 1 },
          activeCustomers: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
          totalRevenue: { $sum: '$totalSpent' },
          totalOrders: { $sum: '$totalOrders' }
        }
      }
    ]);

    const customerStats = stats[0] || {
      totalCustomers: 0,
      activeCustomers: 0,
      totalRevenue: 0,
      totalOrders: 0
    };

    customerStats.averageOrderValue = customerStats.totalOrders > 0 
      ? customerStats.totalRevenue / customerStats.totalOrders 
      : 0;

    res.status(200).json({
      success: true,
      data: {
        customers,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        },
        stats: customerStats
      }
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching customers',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate('createdBy', 'firstName lastName')
      .populate('updatedBy', 'firstName lastName');

    if (!customer || !customer.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Get customer's recent orders
    const recentOrders = await Order.find({
      'customer.email': customer.email,
      isActive: true
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('orderNumber type status totalAmount createdAt');

    res.status(200).json({
      success: true,
      data: {
        customer,
        recentOrders
      }
    });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching customer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create new customer
// @route   POST /api/customers
// @access  Private
const createCustomer = async (req, res) => {
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

    // Check if customer with email already exists
    const existingCustomer = await Customer.findOne({ 
      email: req.body.email,
      isActive: true 
    });

    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: 'Customer with this email already exists'
      });
    }

    // Create customer
    const customerData = {
      ...req.body,
      createdBy: req.user.id
    };

    const customer = await Customer.create(customerData);

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: customer
    });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating customer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
const updateCustomer = async (req, res) => {
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

    const customer = await Customer.findById(req.params.id);

    if (!customer || !customer.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Check if email is being changed and if it conflicts
    if (req.body.email && req.body.email !== customer.email) {
      const existingCustomer = await Customer.findOne({
        email: req.body.email,
        _id: { $ne: req.params.id },
        isActive: true
      });

      if (existingCustomer) {
        return res.status(400).json({
          success: false,
          message: 'Customer with this email already exists'
        });
      }
    }

    // Update customer
    const updateData = {
      ...req.body,
      updatedBy: req.user.id
    };

    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Customer updated successfully',
      data: updatedCustomer
    });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating customer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete customer (soft delete)
// @route   DELETE /api/customers/:id
// @access  Private
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer || !customer.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Soft delete
    customer.isActive = false;
    customer.updatedBy = req.user.id;
    await customer.save();

    res.status(200).json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting customer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Sync customer stats from orders
// @route   POST /api/customers/:id/sync-stats
// @access  Private
const syncCustomerStats = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer || !customer.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    await customer.updateOrderStats();

    res.status(200).json({
      success: true,
      message: 'Customer stats synchronized successfully',
      data: customer
    });
  } catch (error) {
    console.error('Sync customer stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while syncing customer stats',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Sync all customer stats
// @route   POST /api/customers/sync-all-stats
// @access  Private (Admin only)
const syncAllCustomerStats = async (req, res) => {
  try {
    const count = await Customer.syncAllStats();

    res.status(200).json({
      success: true,
      message: `Successfully synchronized stats for ${count} customers`,
      data: { customersUpdated: count }
    });
  } catch (error) {
    console.error('Sync all customer stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while syncing all customer stats',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get customer analytics
// @route   GET /api/customers/analytics
// @access  Private
const getCustomerAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Customer growth over time
    const customerGrowth = await Customer.aggregate([
      {
        $match: {
          isActive: true,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          newCustomers: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Customer segments by spending
    const customerSegments = await Customer.aggregate([
      { $match: { isActive: true } },
      {
        $bucket: {
          groupBy: '$totalSpent',
          boundaries: [0, 100, 500, 1000, 5000, Infinity],
          default: 'Other',
          output: {
            count: { $sum: 1 },
            totalSpent: { $sum: '$totalSpent' }
          }
        }
      }
    ]);

    // Top customers
    const topCustomers = await Customer.find({ isActive: true })
      .sort({ totalSpent: -1 })
      .limit(10)
      .select('firstName lastName email totalSpent totalOrders');

    // Customer status distribution
    const statusDistribution = await Customer.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        customerGrowth,
        customerSegments,
        topCustomers,
        statusDistribution
      }
    });
  } catch (error) {
    console.error('Customer analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching customer analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  syncCustomerStats,
  syncAllCustomerStats,
  getCustomerAnalytics
};