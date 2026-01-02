/**
 * Order Routes
 *
 * Demonstrates complex RESTful routing with protected routes, granular
 * permission checks, and request validation using express-validator.
 * Handlers are async and use try/catch for error responses; in other modules,
 * errors may be forwarded to centralized middleware via `next(error)`.
 * Uses CommonJS router export.
 */
const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');
const { protect } = require('../middleware/authMiddleware');
const { 
  requireActiveAccount,
  checkPermission 
} = require('../middleware/roleMiddleware');
const { 
  orderValidation, 
  paramValidation, 
  queryValidation 
} = require('../middleware/validationMiddleware');
const { validationResult } = require('express-validator');

// Import WebSocket notifications
const { notifyNewOrder, notifyInventoryUpdate } = require('../config/websocket');

const router = express.Router();

// All routes are protected
router.use(protect);
router.use(requireActiveAccount);

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    // Filter by order type
    if (req.query.type) {
      query.type = req.query.type;
    }
    
    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    // Filter by supplier
    if (req.query.supplier) {
      query.supplier = req.query.supplier;
    }
    
    // Filter by date range
    if (req.query.startDate || req.query.endDate) {
      query.createdAt = {};
      if (req.query.startDate) {
        query.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        query.createdAt.$lte = new Date(req.query.endDate);
      }
    }
    
    // Search by order number or customer name
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { orderNumber: searchRegex },
        { 'customer.name': searchRegex }
      ];
    }

    // Get orders with pagination
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count
    const total = await Order.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page,
      totalPages,
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
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

    const orderData = {
      ...req.body,
      createdBy: req.user.id
    };

    // Validate product availability for sale orders
    if (orderData.type === 'sale') {
      for (const item of orderData.items) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(400).json({
            success: false,
            message: `Product with ID ${item.product} not found`
          });
        }
        
        if (product.quantity < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for product ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`
          });
        }
      }
    }

    const order = await Order.create(orderData);

    // Notify clients about new order
    notifyNewOrder(order);

    // Update product quantities for sale orders
    if (orderData.type === 'sale') {
      for (const item of orderData.items) {
        const product = await Product.findByIdAndUpdate(
          item.product,
          { $inc: { quantity: -item.quantity } },
          { new: true }
        );
        
        if (product) {
          // Notify about inventory update
          notifyInventoryUpdate(product);
          
          // Check for low stock
          if (product.quantity <= (product.lowStockThreshold || 10)) {
            const { notifyLowStock } = require('../config/websocket');
            notifyLowStock(product);
          }
        }
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedBy: req.user.id
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Prevent deletion of confirmed orders
    if (['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete order with status: ' + order.status
      });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private
const getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalValue: { $sum: '$totalAmount' },
          averageOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    // Orders by status
    const byStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Orders by type
    const byType = await Order.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalValue: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .select('orderNumber type status totalAmount createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || { totalOrders: 0, totalValue: 0, averageOrderValue: 0 },
        byStatus,
        byType,
        recentOrders
      }
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Routes
router.get('/stats', checkPermission('read', 'orders'), getOrderStats);
router.get('/', checkPermission('read', 'orders'), queryValidation.pagination, getOrders);
router.post('/', checkPermission('create', 'orders'), orderValidation.create, createOrder);
router.get('/:id', checkPermission('read', 'orders'), paramValidation.mongoId, getOrder);
router.put('/:id', checkPermission('update', 'orders'), paramValidation.mongoId, updateOrder);
router.delete('/:id', checkPermission('delete', 'orders'), paramValidation.mongoId, deleteOrder);

module.exports = router;