const Category = require('../models/Category');
const Product = require('../models/Product');
const { validationResult } = require('express-validator');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
const getCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    // Filter by active status
    if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === 'true';
    }
    
    // Filter by parent category
    if (req.query.parent) {
      query.parentCategory = req.query.parent === 'null' ? null : req.query.parent;
    }
    
    // Search by name
    if (req.query.search) {
      query.name = new RegExp(req.query.search, 'i');
    }

    // Get categories with pagination
    const categories = await Category.find(query)
      .populate('createdBy', 'firstName lastName')
      .populate('productCount')
      .sort({ sortOrder: 1, name: 1 })
      .skip(skip)
      .limit(limit);

    // Get total count
    const total = await Category.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      count: categories.length,
      total,
      page,
      totalPages,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get category tree
// @route   GET /api/categories/tree
// @access  Private
const getCategoryTree = async (req, res) => {
  try {
    // Get all active categories
    const categories = await Category.find({ isActive: true })
      .populate('productCount')
      .sort({ sortOrder: 1, name: 1 });

    // Build tree structure
    const categoryMap = {};
    const tree = [];

    // First pass: create map of all categories
    categories.forEach(category => {
      categoryMap[category._id] = {
        ...category.toObject(),
        children: []
      };
    });

    // Second pass: build tree structure
    categories.forEach(category => {
      if (category.parentCategory) {
        const parent = categoryMap[category.parentCategory];
        if (parent) {
          parent.children.push(categoryMap[category._id]);
        }
      } else {
        tree.push(categoryMap[category._id]);
      }
    });

    res.status(200).json({
      success: true,
      data: tree
    });
  } catch (error) {
    console.error('Get category tree error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching category tree',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Private
const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('createdBy', 'firstName lastName')
      .populate('parentCategory', 'name slug')
      .populate('productCount');
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching category',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private
const createCategory = async (req, res) => {
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

    const categoryData = {
      ...req.body,
      createdBy: req.user.id
    };

    // Check if category name already exists
    const existingCategory = await Category.findOne({ 
      name: new RegExp(`^${req.body.name}$`, 'i') 
    });
    
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    const category = await Category.create(categoryData);

    // If this category has a parent, add it to parent's subcategories
    if (category.parentCategory) {
      await Category.findByIdAndUpdate(
        category.parentCategory,
        { $push: { subcategories: category._id } }
      );
    }

    // Populate the created category
    await category.populate('createdBy', 'firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating category',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = async (req, res) => {
  try {
    const { name, description, parentCategory, isActive, sortOrder, metadata } = req.body;

    // Check if name is being changed and if it already exists
    if (name) {
      const existingCategory = await Category.findOne({ 
        name: new RegExp(`^${name}$`, 'i'),
        _id: { $ne: req.params.id } 
      });
      
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Category with this name already exists'
        });
      }
    }

    // Get current category to handle parent changes
    const currentCategory = await Category.findById(req.params.id);
    if (!currentCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Update category
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        parentCategory,
        isActive,
        sortOrder,
        metadata
      },
      {
        new: true,
        runValidators: true
      }
    ).populate('createdBy', 'firstName lastName');

    // Handle parent category changes
    if (currentCategory.parentCategory && currentCategory.parentCategory.toString() !== parentCategory) {
      // Remove from old parent's subcategories
      await Category.findByIdAndUpdate(
        currentCategory.parentCategory,
        { $pull: { subcategories: req.params.id } }
      );
    }

    if (parentCategory && parentCategory !== currentCategory.parentCategory?.toString()) {
      // Add to new parent's subcategories
      await Category.findByIdAndUpdate(
        parentCategory,
        { $addToSet: { subcategories: req.params.id } }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating category',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has products
    const productCount = await Product.countDocuments({ category: req.params.id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${productCount} products assigned to it.`
      });
    }

    // Check if category has subcategories
    if (category.subcategories && category.subcategories.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category. It has subcategories assigned to it.'
      });
    }

    // Remove from parent's subcategories if it has a parent
    if (category.parentCategory) {
      await Category.findByIdAndUpdate(
        category.parentCategory,
        { $pull: { subcategories: req.params.id } }
      );
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting category',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get category statistics
// @route   GET /api/categories/stats
// @access  Private
const getCategoryStats = async (req, res) => {
  try {
    const stats = await Category.aggregate([
      {
        $group: {
          _id: null,
          totalCategories: { $sum: 1 },
          activeCategories: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          },
          parentCategories: {
            $sum: { $cond: [{ $eq: ['$parentCategory', null] }, 1, 0] }
          },
          subcategories: {
            $sum: { $cond: [{ $ne: ['$parentCategory', null] }, 1, 0] }
          }
        }
      }
    ]);

    // Get categories with most products
    const topCategories = await Category.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'category',
          as: 'products'
        }
      },
      {
        $project: {
          name: 1,
          productCount: { $size: '$products' }
        }
      },
      {
        $sort: { productCount: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || { 
          totalCategories: 0, 
          activeCategories: 0, 
          parentCategories: 0, 
          subcategories: 0 
        },
        topCategories
      }
    });
  } catch (error) {
    console.error('Get category stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching category statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getCategories,
  getCategoryTree,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats
};