const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  type: {
    type: String,
    enum: ['in', 'out', 'adjustment', 'transfer', 'damaged', 'expired', 'returned'],
    required: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    validate: {
      validator: function(value) {
        return value !== 0;
      },
      message: 'Quantity cannot be zero'
    }
  },
  previousQuantity: {
    type: Number,
    required: true
  },
  newQuantity: {
    type: Number,
    required: true
  },
  unitCost: {
    type: Number,
    min: [0, 'Unit cost cannot be negative'],
    default: 0
  },
  totalCost: {
    type: Number,
    default: 0
  },
  reason: {
    type: String,
    enum: [
      'purchase',
      'sale',
      'return',
      'adjustment',
      'damage',
      'expiry',
      'theft',
      'transfer-in',
      'transfer-out',
      'initial-stock',
      'recount',
      'other'
    ],
    required: true
  },
  reference: {
    type: String,
    trim: true
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'referenceModel'
  },
  referenceModel: {
    type: String,
    enum: ['Order', 'StockAdjustment', 'Transfer']
  },
  location: {
    warehouse: {
      type: String,
      default: 'main'
    },
    zone: {
      type: String,
      default: 'general'
    },
    shelf: {
      type: String
    },
    bin: {
      type: String
    }
  },
  batchNumber: {
    type: String,
    trim: true
  },
  expiryDate: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes
stockMovementSchema.index({ product: 1 });
stockMovementSchema.index({ type: 1 });
stockMovementSchema.index({ reason: 1 });
stockMovementSchema.index({ createdAt: -1 });
stockMovementSchema.index({ referenceId: 1 });
stockMovementSchema.index({ batchNumber: 1 });

// Calculate total cost before saving
stockMovementSchema.pre('save', function(next) {
  this.totalCost = Math.abs(this.quantity) * this.unitCost;
  next();
});

// Populate product details
stockMovementSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'product',
    select: 'name sku category'
  }).populate({
    path: 'createdBy',
    select: 'firstName lastName'
  });
  next();
});

// Static method to get stock movements for a product
stockMovementSchema.statics.getProductMovements = function(productId, limit = 50) {
  return this.find({ product: productId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get movements by date range
stockMovementSchema.statics.getMovementsByDateRange = function(startDate, endDate, filters = {}) {
  const query = {
    createdAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    },
    ...filters
  };
  
  return this.find(query).sort({ createdAt: -1 });
};

module.exports = mongoose.model('StockMovement', stockMovementSchema);