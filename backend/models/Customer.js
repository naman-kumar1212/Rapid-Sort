const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  address: {
    street: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    zipCode: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true,
      default: 'USA'
    }
  },
  dateOfBirth: {
    type: Date
  },
  customerType: {
    type: String,
    enum: ['individual', 'business'],
    default: 'individual'
  },
  companyName: {
    type: String,
    trim: true
  },
  taxId: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  preferredPaymentMethod: {
    type: String,
    enum: ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'check'],
    default: 'cash'
  },
  creditLimit: {
    type: Number,
    default: 0,
    min: [0, 'Credit limit cannot be negative']
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  tags: [{
    type: String,
    trim: true
  }],
  // Calculated fields (updated by triggers/middleware)
  totalOrders: {
    type: Number,
    default: 0,
    min: 0
  },
  totalSpent: {
    type: Number,
    default: 0,
    min: 0
  },
  averageOrderValue: {
    type: Number,
    default: 0,
    min: 0
  },
  lastOrderDate: {
    type: Date
  },
  firstOrderDate: {
    type: Date
  },
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
customerSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for full address
customerSchema.virtual('fullAddress').get(function() {
  if (!this.address.street) return '';
  
  const parts = [
    this.address.street,
    this.address.city,
    this.address.state,
    this.address.zipCode,
    this.address.country
  ].filter(part => part && part.trim());
  
  return parts.join(', ');
});

// Virtual for customer lifetime value
customerSchema.virtual('lifetimeValue').get(function() {
  return this.totalSpent;
});

// Index for efficient queries (email index is automatically created by unique: true)
customerSchema.index({ status: 1 });
customerSchema.index({ createdAt: -1 });
customerSchema.index({ totalSpent: -1 });
customerSchema.index({ lastOrderDate: -1 });
customerSchema.index({ firstName: 1, lastName: 1 });

// Text search index
customerSchema.index({
  firstName: 'text',
  lastName: 'text',
  email: 'text',
  companyName: 'text'
});

// Middleware to update calculated fields
customerSchema.methods.updateOrderStats = async function() {
  const Order = mongoose.model('Order');
  
  const stats = await Order.aggregate([
    {
      $match: {
        'customer.email': this.email,
        type: 'sale',
        status: { $in: ['confirmed', 'delivered', 'completed'] }
      }
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: '$totalAmount' },
        firstOrder: { $min: '$createdAt' },
        lastOrder: { $max: '$createdAt' }
      }
    }
  ]);

  if (stats.length > 0) {
    const stat = stats[0];
    this.totalOrders = stat.totalOrders;
    this.totalSpent = stat.totalSpent;
    this.averageOrderValue = stat.totalSpent / stat.totalOrders;
    this.firstOrderDate = stat.firstOrder;
    this.lastOrderDate = stat.lastOrder;
  } else {
    this.totalOrders = 0;
    this.totalSpent = 0;
    this.averageOrderValue = 0;
    this.firstOrderDate = null;
    this.lastOrderDate = null;
  }

  await this.save();
};

// Static method to sync all customer stats
customerSchema.statics.syncAllStats = async function() {
  const customers = await this.find({ isActive: true });
  
  for (const customer of customers) {
    await customer.updateOrderStats();
  }
  
  return customers.length;
};

// Pre-save middleware
customerSchema.pre('save', function(next) {
  if (this.isModified('firstName') || this.isModified('lastName')) {
    // Ensure names are properly capitalized
    this.firstName = this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1).toLowerCase();
    this.lastName = this.lastName.charAt(0).toUpperCase() + this.lastName.slice(1).toLowerCase();
  }
  
  next();
});

module.exports = mongoose.model('Customer', customerSchema);