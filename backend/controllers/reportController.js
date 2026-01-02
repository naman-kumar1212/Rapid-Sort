const Product = require('../models/Product');
const Order = require('../models/Order');
const StockMovement = require('../models/StockMovement');
const Supplier = require('../models/Supplier');
const Customer = require('../models/Customer');
const Category = require('../models/Category');

// @desc    Generate inventory report
// @route   GET /api/reports/inventory
// @access  Private
const getInventoryReport = async (req, res) => {
  try {
    const { format = 'json', category, supplier, lowStock } = req.query;

    // Build query
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (supplier) {
      query.supplier = supplier;
    }
    
    if (lowStock === 'true') {
      query.$expr = { $lte: ['$quantity', '$minStockLevel'] };
    }

    const products = await Product.find(query)
      .populate('category', 'name')
      .populate('supplier', 'name companyName')
      .select('name sku price quantity minStockLevel maxStockLevel category supplier createdAt')
      .sort({ name: 1 });

    // Calculate totals
    const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    const lowStockItems = products.filter(p => p.quantity <= p.minStockLevel).length;
    const outOfStockItems = products.filter(p => p.quantity === 0).length;

    // Group by category
    const categoryGroups = {};
    products.forEach(product => {
      const categoryName = product.category?.name || 'Uncategorized';
      if (!categoryGroups[categoryName]) {
        categoryGroups[categoryName] = {
          categoryName,
          productCount: 0,
          totalValue: 0
        };
      }
      categoryGroups[categoryName].productCount += 1;
      categoryGroups[categoryName].totalValue += product.price * product.quantity;
    });

    const categories = Object.values(categoryGroups);

    const report = {
      totalProducts: products.length,
      totalValue,
      lowStockItems,
      outOfStockItems,
      categories,
      generatedAt: new Date(),
      generatedBy: req.user.id,
      type: 'inventory',
      filters: { category, supplier, lowStock }
    };

    if (format === 'csv') {
      const csvHeader = 'Name,SKU,Category,Supplier,Price,Quantity,Min Stock,Max Stock,Value\n';
      const csvData = products.map(p => 
        `"${p.name}","${p.sku}","${p.category?.name || ''}","${p.supplier?.name || ''}",${p.price},${p.quantity},${p.minStockLevel},${p.maxStockLevel},${p.price * p.quantity}`
      ).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=inventory-report.csv');
      return res.send(csvHeader + csvData);
    }

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Inventory report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating inventory report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Generate sales report
// @route   GET /api/reports/sales
// @access  Private
const getSalesReport = async (req, res) => {
  try {
    const { 
      format = 'json', 
      startDate, 
      endDate, 
      status = 'confirmed,delivered,completed'
    } = req.query;

    // Date range - default to last 30 days if not specified
    const dateQuery = {};
    if (startDate && endDate) {
      dateQuery.$gte = new Date(startDate);
      dateQuery.$lte = new Date(endDate);
    } else if (!startDate && !endDate) {
      // Default to last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      dateQuery.$gte = thirtyDaysAgo;
      dateQuery.$lte = new Date();
    }

    // Status filter
    const statusArray = status.split(',');

    const orders = await Order.find({
      type: 'sale',
      status: { $in: statusArray },
      ...(Object.keys(dateQuery).length > 0 && { createdAt: dateQuery })
    })
    .populate('items.product', 'name sku category')
    .sort({ createdAt: -1 });

    // Calculate top products
    const productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.product) {
          const productId = item.product._id.toString();
          if (!productSales[productId]) {
            productSales[productId] = {
              productName: item.product.name,
              sku: item.product.sku,
              quantitySold: 0,
              revenue: 0
            };
          }
          productSales[productId].quantitySold += item.quantity;
          productSales[productId].revenue += item.totalPrice;
        }
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 20);

    // Calculate summary
    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Format period
    let period = 'All Time';
    if (startDate && endDate) {
      period = `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`;
    } else if (Object.keys(dateQuery).length > 0) {
      period = 'Last 30 Days';
    }

    const report = {
      totalSales,
      totalOrders,
      averageOrderValue,
      period,
      topProducts,
      generatedAt: new Date(),
      generatedBy: req.user.id,
      type: 'sales',
      filters: { startDate, endDate, status }
    };

    if (format === 'csv') {
      const csvHeader = 'Product Name,SKU,Quantity Sold,Revenue\n';
      const csvData = topProducts.map(p => 
        `"${p.productName}","${p.sku}",${p.quantitySold},${p.revenue}`
      ).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=sales-report.csv');
      return res.send(csvHeader + csvData);
    }

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Sales report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating sales report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Generate stock movement report
// @route   GET /api/reports/stock-movements
// @access  Private
const getStockMovementReport = async (req, res) => {
  try {
    const { 
      format = 'json', 
      startDate, 
      endDate, 
      product, 
      type,
      reason 
    } = req.query;

    // Build query
    let query = {};
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    if (product) query.product = product;
    if (type) query.type = type;
    if (reason) query.reason = reason;

    const movements = await StockMovement.find(query)
      .populate('product', 'name sku')
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    // Calculate summary
    const summary = {
      totalMovements: movements.length,
      totalIn: movements.filter(m => m.type === 'in').reduce((sum, m) => sum + m.quantity, 0),
      totalOut: movements.filter(m => m.type === 'out').reduce((sum, m) => sum + Math.abs(m.quantity), 0),
      netMovement: movements.reduce((sum, m) => sum + m.quantity, 0)
    };

    // Group by reason
    const byReason = movements.reduce((acc, movement) => {
      if (!acc[movement.reason]) {
        acc[movement.reason] = { count: 0, totalQuantity: 0 };
      }
      acc[movement.reason].count += 1;
      acc[movement.reason].totalQuantity += movement.quantity;
      return acc;
    }, {});

    const report = {
      generatedAt: new Date(),
      generatedBy: req.user.id,
      type: 'stock-movements',
      filters: { startDate, endDate, product, type, reason },
      summary,
      byReason,
      data: movements
    };

    if (format === 'csv') {
      const csvHeader = 'Date,Product,SKU,Type,Quantity,Previous Qty,New Qty,Reason,Reference,Created By\n';
      const csvData = movements.map(m => 
        `${m.createdAt.toISOString().split('T')[0]},"${m.product?.name || ''}","${m.product?.sku || ''}",${m.type},${m.quantity},${m.previousQuantity},${m.newQuantity},${m.reason},"${m.reference || ''}","${m.createdBy?.firstName || ''} ${m.createdBy?.lastName || ''}"`
      ).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=stock-movements-report.csv');
      return res.send(csvHeader + csvData);
    }

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Stock movement report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating stock movement report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Generate supplier performance report
// @route   GET /api/reports/supplier-performance
// @access  Private
const getSupplierPerformanceReport = async (req, res) => {
  try {
    const { format = 'json', startDate, endDate } = req.query;

    // Date range for orders
    const dateQuery = {};
    if (startDate) dateQuery.$gte = new Date(startDate);
    if (endDate) dateQuery.$lte = new Date(endDate);

    // Get supplier performance data
    const supplierPerformance = await Order.aggregate([
      {
        $match: {
          type: 'purchase',
          supplier: { $exists: true },
          ...(Object.keys(dateQuery).length > 0 && { createdAt: dateQuery })
        }
      },
      {
        $group: {
          _id: '$supplier',
          totalOrders: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
          averageOrderValue: { $avg: '$totalAmount' },
          onTimeDeliveries: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          }
        }
      },
      {
        $lookup: {
          from: 'suppliers',
          localField: '_id',
          foreignField: '_id',
          as: 'supplier'
        }
      },
      { $unwind: '$supplier' },
      {
        $project: {
          supplierName: '$supplier.name',
          companyName: '$supplier.companyName',
          email: '$supplier.email',
          totalOrders: 1,
          totalAmount: 1,
          averageOrderValue: 1,
          onTimeDeliveries: 1,
          cancelledOrders: 1,
          deliveryRate: {
            $cond: {
              if: { $gt: ['$totalOrders', 0] },
              then: { $multiply: [{ $divide: ['$onTimeDeliveries', '$totalOrders'] }, 100] },
              else: 0
            }
          },
          cancellationRate: {
            $cond: {
              if: { $gt: ['$totalOrders', 0] },
              then: { $multiply: [{ $divide: ['$cancelledOrders', '$totalOrders'] }, 100] },
              else: 0
            }
          }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    const report = {
      generatedAt: new Date(),
      generatedBy: req.user.id,
      type: 'supplier-performance',
      filters: { startDate, endDate },
      summary: {
        totalSuppliers: supplierPerformance.length,
        totalPurchaseValue: supplierPerformance.reduce((sum, s) => sum + s.totalAmount, 0),
        averageDeliveryRate: supplierPerformance.length > 0 
          ? supplierPerformance.reduce((sum, s) => sum + s.deliveryRate, 0) / supplierPerformance.length 
          : 0
      },
      data: supplierPerformance
    };

    if (format === 'csv') {
      const csvHeader = 'Supplier Name,Company,Email,Total Orders,Total Amount,Avg Order Value,On-Time Deliveries,Cancelled Orders,Delivery Rate %,Cancellation Rate %\n';
      const csvData = supplierPerformance.map(s => 
        `"${s.supplierName}","${s.companyName}","${s.email}",${s.totalOrders},${s.totalAmount},${s.averageOrderValue.toFixed(2)},${s.onTimeDeliveries},${s.cancelledOrders},${s.deliveryRate.toFixed(2)},${s.cancellationRate.toFixed(2)}`
      ).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=supplier-performance-report.csv');
      return res.send(csvHeader + csvData);
    }

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Supplier performance report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating supplier performance report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Generate customer report
// @route   GET /api/reports/customers
// @access  Private
const getCustomerReport = async (req, res) => {
  try {
    const { 
      format = 'json', 
      startDate, 
      endDate,
      status = 'active'
    } = req.query;

    // Date range for new customers
    const dateQuery = {};
    if (startDate && endDate) {
      dateQuery.$gte = new Date(startDate);
      dateQuery.$lte = new Date(endDate);
    } else if (!startDate && !endDate) {
      // Default to last 30 days for new customers
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      dateQuery.$gte = thirtyDaysAgo;
      dateQuery.$lte = new Date();
    }

    // Get all customers
    const allCustomers = await Customer.find({ 
      isActive: true,
      ...(status !== 'all' && { status })
    }).sort({ totalSpent: -1 });

    // Get new customers in the date range
    const newCustomers = await Customer.find({
      isActive: true,
      ...(status !== 'all' && { status }),
      ...(Object.keys(dateQuery).length > 0 && { createdAt: dateQuery })
    });

    // Get repeat customers (customers with more than 1 order)
    const repeatCustomers = allCustomers.filter(customer => customer.totalOrders > 1);

    // Get top customers by spending
    const topCustomers = allCustomers
      .filter(customer => customer.totalSpent > 0)
      .slice(0, 20)
      .map(customer => ({
        customerName: customer.fullName,
        email: customer.email,
        totalOrders: customer.totalOrders,
        totalSpent: customer.totalSpent
      }));

    const report = {
      totalCustomers: allCustomers.length,
      newCustomers: newCustomers.length,
      repeatCustomers: repeatCustomers.length,
      topCustomers,
      generatedAt: new Date(),
      generatedBy: req.user.id,
      type: 'customers',
      filters: { startDate, endDate, status }
    };

    if (format === 'csv') {
      const csvHeader = 'Customer Name,Email,Total Orders,Total Spent\n';
      const csvData = topCustomers.map(c => 
        `"${c.customerName}","${c.email}",${c.totalOrders},${c.totalSpent}`
      ).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=customer-report.csv');
      return res.send(csvHeader + csvData);
    }

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Customer report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating customer report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Generate supplier report
// @route   GET /api/reports/suppliers
// @access  Private
const getSupplierReport = async (req, res) => {
  try {
    const { format = 'json', status = 'active' } = req.query;

    // Get all suppliers
    const allSuppliers = await Supplier.find({ 
      isActive: true,
      ...(status !== 'all' && { status })
    });

    // Get suppliers with products
    const suppliersWithProducts = await Product.aggregate([
      {
        $match: { isActive: true, supplier: { $exists: true } }
      },
      {
        $group: {
          _id: '$supplier',
          totalProducts: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$price', '$quantity'] } }
        }
      },
      {
        $lookup: {
          from: 'suppliers',
          localField: '_id',
          foreignField: '_id',
          as: 'supplier'
        }
      },
      { $unwind: '$supplier' },
      {
        $project: {
          supplierName: '$supplier.name',
          companyName: '$supplier.companyName',
          totalProducts: 1,
          totalValue: 1
        }
      },
      { $sort: { totalValue: -1 } }
    ]);

    const activeSuppliers = allSuppliers.filter(s => s.status === 'active').length;

    const report = {
      totalSuppliers: allSuppliers.length,
      activeSuppliers,
      topSuppliers: suppliersWithProducts.slice(0, 20),
      generatedAt: new Date(),
      generatedBy: req.user.id,
      type: 'suppliers',
      filters: { status }
    };

    if (format === 'csv') {
      const csvHeader = 'Supplier Name,Company,Total Products,Total Value\n';
      const csvData = suppliersWithProducts.map(s => 
        `"${s.supplierName}","${s.companyName || ''}",${s.totalProducts},${s.totalValue}`
      ).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=supplier-report.csv');
      return res.send(csvHeader + csvData);
    }

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Supplier report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating supplier report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getInventoryReport,
  getSalesReport,
  getStockMovementReport,
  getSupplierPerformanceReport,
  getCustomerReport,
  getSupplierReport
};