const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const Supplier = require('../models/Supplier');
const User = require('../models/User');
const StockMovement = require('../models/StockMovement');

// @desc    Get dashboard overview statistics
// @route   GET /api/dashboard/overview
// @access  Private
const getDashboardOverview = async (req, res) => {
  try {
    // Get basic counts
    const [productCount, orderCount, supplierCount, categoryCount, userCount] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Supplier.countDocuments({ isActive: true }),
      Category.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: true })
    ]);

    // Get inventory value
    const inventoryValue = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ['$price', '$quantity'] } },
          totalQuantity: { $sum: '$quantity' }
        }
      }
    ]);

    // Get low stock products
    const lowStockProducts = await Product.countDocuments({
      isActive: true,
      $expr: { $lte: ['$quantity', '$minStockLevel'] }
    });

    // Get recent orders
    const recentOrders = await Order.find()
      .select('orderNumber type status totalAmount createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get monthly sales data (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlySales = await Order.aggregate([
      {
        $match: {
          type: 'sale',
          status: { $in: ['confirmed', 'delivered'] },
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get top selling products
    const topProducts = await Order.aggregate([
      { $match: { type: 'sale', status: { $in: ['confirmed', 'delivered'] } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.unitPrice'] } }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          sku: '$product.sku',
          totalQuantity: 1,
          totalRevenue: 1
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        counts: {
          products: productCount,
          orders: orderCount,
          suppliers: supplierCount,
          categories: categoryCount,
          users: userCount
        },
        inventory: {
          totalValue: inventoryValue[0]?.totalValue || 0,
          totalQuantity: inventoryValue[0]?.totalQuantity || 0,
          lowStockCount: lowStockProducts
        },
        recentOrders,
        monthlySales,
        topProducts
      }
    });
  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get inventory analytics
// @route   GET /api/dashboard/inventory
// @access  Private
const getInventoryAnalytics = async (req, res) => {
  try {
    // Products by category
    const productsByCategory = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      { $unwind: { path: '$categoryInfo', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$categoryInfo.name',
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$price', '$quantity'] } },
          totalQuantity: { $sum: '$quantity' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Stock levels distribution
    const stockLevels = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $project: {
          name: 1,
          quantity: 1,
          minStockLevel: 1,
          maxStockLevel: 1,
          stockStatus: {
            $cond: {
              if: { $lte: ['$quantity', '$minStockLevel'] },
              then: 'low',
              else: {
                $cond: {
                  if: { $gte: ['$quantity', '$maxStockLevel'] },
                  then: 'high',
                  else: 'normal'
                }
              }
            }
          }
        }
      },
      {
        $group: {
          _id: '$stockStatus',
          count: { $sum: 1 },
          products: { $push: { name: '$name', quantity: '$quantity' } }
        }
      }
    ]);

    // Most valuable products
    const valuableProducts = await Product.find({ isActive: true })
      .select('name sku price quantity')
      .sort({ price: -1 })
      .limit(10);

    // Recent stock movements
    const recentMovements = await StockMovement.find()
      .populate('product', 'name sku')
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        productsByCategory,
        stockLevels,
        valuableProducts,
        recentMovements
      }
    });
  } catch (error) {
    console.error('Inventory analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching inventory analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get sales analytics
// @route   GET /api/dashboard/sales
// @access  Private
const getSalesAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Sales over time
    const salesOverTime = await Order.aggregate([
      {
        $match: {
          type: 'sale',
          status: { $in: ['confirmed', 'delivered'] },
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Sales by status
    const salesByStatus = await Order.aggregate([
      {
        $match: {
          type: 'sale',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Top customers (if customer info is stored)
    const topCustomers = await Order.aggregate([
      {
        $match: {
          type: 'sale',
          status: { $in: ['confirmed', 'delivered'] },
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$customer.email',
          customerName: { $first: '$customer.name' },
          totalSpent: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 }
    ]);

    // Average order value
    const avgOrderValue = await Order.aggregate([
      {
        $match: {
          type: 'sale',
          status: { $in: ['confirmed', 'delivered'] },
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          avgValue: { $avg: '$totalAmount' },
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        salesOverTime,
        salesByStatus,
        topCustomers,
        summary: avgOrderValue[0] || { avgValue: 0, totalOrders: 0, totalRevenue: 0 }
      }
    });
  } catch (error) {
    console.error('Sales analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching sales analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get alerts and notifications
// @route   GET /api/dashboard/alerts
// @access  Private
const getAlerts = async (req, res) => {
  try {
    const alerts = [];

    // Low stock alerts
    const lowStockProducts = await Product.find({
      isActive: true,
      $expr: { $lte: ['$quantity', '$minStockLevel'] }
    }).select('name sku quantity minStockLevel');

    lowStockProducts.forEach(product => {
      alerts.push({
        type: 'low_stock',
        severity: product.quantity === 0 ? 'critical' : 'warning',
        title: product.quantity === 0 ? 'Out of Stock' : 'Low Stock Alert',
        message: `${product.name} (${product.sku}) has ${product.quantity} units remaining`,
        data: product,
        createdAt: new Date()
      });
    });

    // Overstock alerts
    const overstockProducts = await Product.find({
      isActive: true,
      maxStockLevel: { $gt: 0 },
      $expr: { $gte: ['$quantity', '$maxStockLevel'] }
    }).select('name sku quantity maxStockLevel');

    overstockProducts.forEach(product => {
      alerts.push({
        type: 'overstock',
        severity: 'info',
        title: 'Overstock Alert',
        message: `${product.name} (${product.sku}) has ${product.quantity} units (max: ${product.maxStockLevel})`,
        data: product,
        createdAt: new Date()
      });
    });

    // Pending orders
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    if (pendingOrders > 0) {
      alerts.push({
        type: 'pending_orders',
        severity: 'warning',
        title: 'Pending Orders',
        message: `You have ${pendingOrders} pending orders that need attention`,
        data: { count: pendingOrders },
        createdAt: new Date()
      });
    }

    // Expired products (if expiry date is tracked)
    const expiredProducts = await Product.find({
      isActive: true,
      expiryDate: { $lt: new Date() }
    }).select('name sku expiryDate quantity');

    expiredProducts.forEach(product => {
      alerts.push({
        type: 'expired',
        severity: 'critical',
        title: 'Expired Product',
        message: `${product.name} (${product.sku}) expired on ${product.expiryDate.toDateString()}`,
        data: product,
        createdAt: new Date()
      });
    });

    // Sort alerts by severity and date
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    alerts.sort((a, b) => {
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[a.severity] - severityOrder[b.severity];
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.status(200).json({
      success: true,
      data: {
        alerts,
        summary: {
          total: alerts.length,
          critical: alerts.filter(a => a.severity === 'critical').length,
          warning: alerts.filter(a => a.severity === 'warning').length,
          info: alerts.filter(a => a.severity === 'info').length
        }
      }
    });
  } catch (error) {
    console.error('Alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching alerts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getDashboardOverview,
  getInventoryAnalytics,
  getSalesAnalytics,
  getAlerts
};