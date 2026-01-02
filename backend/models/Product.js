/**
 * Product Model (Mongoose)
 *
 * Defines product fields with validation and helpful indexes for search/sort.
 * Demonstrates schema options with timestamps and CommonJS export.
 */
const mongoose = require('mongoose');

/**
 * Product Schema
 *
 * Defines the structure of the product document in the database.
 * Includes validation rules for each field.
 */
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  quantity: {
    type: Number,
    default: 0,
    min: [0, 'Quantity cannot be negative'],
    validate: {
      validator: Number.isInteger,
      message: 'Quantity must be a whole number'
    }
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  supplier: {
    type: String,
    trim: true,
    maxlength: [100, 'Supplier name cannot exceed 100 characters']
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Index for better search performance
productSchema.index({ name: 'text', category: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ quantity: 1 });

module.exports = mongoose.model('Product', productSchema);