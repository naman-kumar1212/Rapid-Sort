// Middleware to set the appropriate Product model based on database availability
let Product;
let dbType = 'memory';

// Try to detect if MongoDB is available
const initializeDB = async () => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      Product = require('../models/Product');
      dbType = 'mongodb';
      console.log('✅ Using MongoDB Product model');
    } else {
      throw new Error('MongoDB not connected');
    }
  } catch (error) {
    Product = require('../models/ProductFallback');
    dbType = 'memory';
    console.log('⚠️  Using in-memory Product model');
  }
};

// Initialize on startup
initializeDB();

const dbMiddleware = (req, res, next) => {
  req.Product = Product;
  req.dbType = dbType;
  next();
};

module.exports = { dbMiddleware, initializeDB };