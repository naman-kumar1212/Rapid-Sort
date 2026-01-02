/**
 * Product Controller
 *
 * Express controllers encapsulate request-handling logic separate from routing.
 * Each function below is an async handler that uses async/await for database I/O
 * and propagates errors using `next(error)` so the centralized error middleware
 * (`backend/middleware/errorMiddleware.js`) can format responses.
 *
 * This file demonstrates a CommonJS pattern for conditional module loading: we
 * try to require the Mongo-backed model and fall back to an in-memory model if
 * MongoDB is not available. This is helpful for local development or CI.
 *
 * The list endpoint showcases typical API features: filtering, sorting, and
 * pagination through query parameters.
 */
// Try to use MongoDB Product model, fall back to in-memory model
let Product;
try {
  Product = require('../models/Product');
} catch (error) {
  console.log('Using fallback in-memory product model');
  Product = require('../models/ProductFallback');
}

// Import WebSocket notifications
const { notifyInventoryUpdate, notifyLowStock } = require('../config/websocket');

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      name,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      minPrice,
      maxPrice,
      minQuantity,
      maxQuantity
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }
    
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    if (minQuantity || maxQuantity) {
      filter.quantity = {};
      if (minQuantity) filter.quantity.$gte = parseInt(minQuantity);
      if (maxQuantity) filter.quantity.$lte = parseInt(maxQuantity);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: parseInt(page),
      totalPages,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Public
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    
    // Notify clients about new product
    notifyInventoryUpdate(product);
    
    // Check for low stock alert
    if (product.quantity <= (product.lowStockThreshold || 10)) {
      notifyLowStock(product);
    }
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Public
const updateProduct = async (req, res, next) => {
  try {
    // Validate quantity if being updated
    if (req.body.quantity !== undefined && req.body.quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity cannot be negative'
      });
    }

    // Get the old product to compare changes
    const oldProduct = await Product.findById(req.params.id);
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Notify clients about product update
    notifyInventoryUpdate(product);
    
    // Check for low stock alert (only if quantity changed)
    if (req.body.quantity !== undefined) {
      const lowStockThreshold = product.lowStockThreshold || 10;
      
      // Alert if stock is now low
      if (product.quantity <= lowStockThreshold) {
        notifyLowStock(product);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Public
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Notify clients about product deletion
    notifyInventoryUpdate({ ...product.toObject(), deleted: true });

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk create products
// @route   POST /api/products/bulk
// @access  Public
const bulkCreateProducts = async (req, res, next) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Products array is required and cannot be empty'
      });
    }

    const createdProducts = await Product.insertMany(products, {
      ordered: false // Continue inserting even if some fail
    });

    // Notify clients about bulk product creation
    createdProducts.forEach(product => {
      notifyInventoryUpdate(product);
      
      // Check for low stock on each product
      if (product.quantity <= (product.lowStockThreshold || 10)) {
        notifyLowStock(product);
      }
    });

    res.status(201).json({
      success: true,
      message: `${createdProducts.length} products created successfully`,
      data: createdProducts
    });
  } catch (error) {
    // Handle bulk insert errors
    if (error.name === 'BulkWriteError') {
      const successfulInserts = error.result.insertedCount;
      const errors = error.writeErrors.map(err => ({
        index: err.index,
        message: err.errmsg
      }));

      return res.status(207).json({
        success: true,
        message: `${successfulInserts} products created successfully, ${errors.length} failed`,
        inserted: successfulInserts,
        errors
      });
    }
    next(error);
  }
};

// @desc    Bulk delete products
// @route   DELETE /api/products/bulk
// @access  Public
const bulkDeleteProducts = async (req, res, next) => {
  try {
    const { productIds } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product IDs array is required and cannot be empty'
      });
    }

    const result = await Product.deleteMany({
      _id: { $in: productIds }
    });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} products deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkCreateProducts,
  bulkDeleteProducts
};