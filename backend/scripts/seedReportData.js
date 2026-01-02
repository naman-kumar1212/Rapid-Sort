/**
 * Seed Sample Data for Reports Testing
 * 
 * Creates sample products, customers, suppliers, and orders for testing reports
 */

const mongoose = require('mongoose');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Supplier = require('../models/Supplier');
const Order = require('../models/Order');
const Category = require('../models/Category');

const seedReportData = async () => {
  try {
    console.log('🌱 Starting report data seeding...');

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await Promise.all([
    //   Product.deleteMany({}),
    //   Customer.deleteMany({}),
    //   Supplier.deleteMany({}),
    //   Order.deleteMany({}),
    //   Category.deleteMany({})
    // ]);

    // Create Categories
    const categories = await Category.insertMany([
      { name: 'Electronics', description: 'Electronic devices and accessories' },
      { name: 'Clothing', description: 'Apparel and fashion items' },
      { name: 'Books', description: 'Books and educational materials' },
      { name: 'Home & Garden', description: 'Home improvement and garden supplies' },
      { name: 'Sports', description: 'Sports equipment and accessories' }
    ]);

    console.log(`✅ Created ${categories.length} categories`);

    // Create Suppliers
    const suppliers = await Supplier.insertMany([
      {
        name: 'TechCorp Solutions',
        companyName: 'TechCorp Solutions Inc.',
        email: 'contact@techcorp.com',
        phone: '+1-555-0101',
        address: {
          street: '123 Tech Street',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94105',
          country: 'USA'
        },
        status: 'active'
      },
      {
        name: 'Fashion Forward',
        companyName: 'Fashion Forward LLC',
        email: 'orders@fashionforward.com',
        phone: '+1-555-0102',
        address: {
          street: '456 Fashion Ave',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        status: 'active'
      },
      {
        name: 'BookWorld Distributors',
        companyName: 'BookWorld Distributors Corp',
        email: 'sales@bookworld.com',
        phone: '+1-555-0103',
        address: {
          street: '789 Library Lane',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA'
        },
        status: 'active'
      }
    ]);

    console.log(`✅ Created ${suppliers.length} suppliers`);

    // Create Products
    const products = await Product.insertMany([
      // Electronics
      {
        name: 'Wireless Bluetooth Headphones',
        sku: 'WBH-001',
        description: 'High-quality wireless headphones with noise cancellation',
        category: categories[0]._id,
        supplier: suppliers[0]._id,
        price: 99.99,
        quantity: 50,
        minStockLevel: 10,
        maxStockLevel: 100,
        isActive: true
      },
      {
        name: 'Smartphone Case',
        sku: 'SPC-002',
        description: 'Protective case for smartphones',
        category: categories[0]._id,
        supplier: suppliers[0]._id,
        price: 19.99,
        quantity: 200,
        minStockLevel: 20,
        maxStockLevel: 300,
        isActive: true
      },
      {
        name: 'USB-C Cable',
        sku: 'USB-003',
        description: 'High-speed USB-C charging cable',
        category: categories[0]._id,
        supplier: suppliers[0]._id,
        price: 12.99,
        quantity: 150,
        minStockLevel: 30,
        maxStockLevel: 200,
        isActive: true
      },
      // Clothing
      {
        name: 'Cotton T-Shirt',
        sku: 'CTS-004',
        description: 'Comfortable cotton t-shirt',
        category: categories[1]._id,
        supplier: suppliers[1]._id,
        price: 24.99,
        quantity: 100,
        minStockLevel: 15,
        maxStockLevel: 150,
        isActive: true
      },
      {
        name: 'Denim Jeans',
        sku: 'DJ-005',
        description: 'Classic denim jeans',
        category: categories[1]._id,
        supplier: suppliers[1]._id,
        price: 59.99,
        quantity: 75,
        minStockLevel: 10,
        maxStockLevel: 100,
        isActive: true
      },
      // Books
      {
        name: 'JavaScript Programming Guide',
        sku: 'JPG-006',
        description: 'Comprehensive guide to JavaScript programming',
        category: categories[2]._id,
        supplier: suppliers[2]._id,
        price: 39.99,
        quantity: 30,
        minStockLevel: 5,
        maxStockLevel: 50,
        isActive: true
      },
      {
        name: 'Business Management Handbook',
        sku: 'BMH-007',
        description: 'Essential handbook for business management',
        category: categories[2]._id,
        supplier: suppliers[2]._id,
        price: 49.99,
        quantity: 25,
        minStockLevel: 5,
        maxStockLevel: 40,
        isActive: true
      }
    ]);

    console.log(`✅ Created ${products.length} products`);

    // Create Customers
    const customers = await Customer.insertMany([
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        phone: '+1-555-1001',
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '90210',
          country: 'USA'
        },
        status: 'active',
        customerType: 'individual'
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@email.com',
        phone: '+1-555-1002',
        address: {
          street: '456 Oak Ave',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62701',
          country: 'USA'
        },
        status: 'active',
        customerType: 'individual'
      },
      {
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@email.com',
        phone: '+1-555-1003',
        address: {
          street: '789 Pine St',
          city: 'Portland',
          state: 'OR',
          zipCode: '97201',
          country: 'USA'
        },
        status: 'active',
        customerType: 'individual'
      },
      {
        firstName: 'Alice',
        lastName: 'Brown',
        email: 'alice.brown@email.com',
        phone: '+1-555-1004',
        address: {
          street: '321 Elm St',
          city: 'Austin',
          state: 'TX',
          zipCode: '73301',
          country: 'USA'
        },
        status: 'active',
        customerType: 'individual'
      }
    ]);

    console.log(`✅ Created ${customers.length} customers`);

    // Create Sample Orders (Sales)
    const orders = [];
    const orderDates = [
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
      new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
      new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),  // 5 days ago
      new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),  // 2 days ago
      new Date()  // Today
    ];

    // Create orders with different products and customers
    for (let i = 0; i < 15; i++) {
      const customer = customers[i % customers.length];
      const orderDate = orderDates[i % orderDates.length];
      
      // Random selection of products for this order
      const orderProducts = [];
      const numProducts = Math.floor(Math.random() * 3) + 1; // 1-3 products per order
      
      for (let j = 0; j < numProducts; j++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 5) + 1; // 1-5 quantity
        
        orderProducts.push({
          product: product._id,
          quantity: quantity,
          unitPrice: product.price,
          totalPrice: quantity * product.price
        });
      }

      const subtotal = orderProducts.reduce((sum, item) => sum + item.totalPrice, 0);
      const taxRate = 0.08; // 8% tax
      const taxAmount = subtotal * taxRate;
      const totalAmount = subtotal + taxAmount;

      orders.push({
        type: 'sale',
        status: ['confirmed', 'delivered', 'completed'][Math.floor(Math.random() * 3)],
        customer: {
          name: customer.fullName,
          email: customer.email,
          phone: customer.phone,
          address: customer.address
        },
        items: orderProducts,
        subtotal: subtotal,
        taxRate: taxRate,
        taxAmount: taxAmount,
        totalAmount: totalAmount,
        paymentMethod: 'credit-card',
        paymentStatus: 'paid',
        createdAt: orderDate,
        updatedAt: orderDate
      });
    }

    // Insert orders without using the pre-save middleware for order numbers
    const createdOrders = await Order.insertMany(orders);
    
    // Update order numbers manually
    for (let i = 0; i < createdOrders.length; i++) {
      const order = createdOrders[i];
      const date = order.createdAt;
      const year = date.getFullYear().toString().substring(2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const sequence = (i + 1).toString().padStart(4, '0');
      
      order.orderNumber = `SA${year}${month}${sequence}`;
      await order.save();
    }

    console.log(`✅ Created ${createdOrders.length} sample orders`);

    // Update customer statistics
    for (const customer of customers) {
      await customer.updateOrderStats();
    }

    console.log('✅ Updated customer statistics');

    console.log('🎉 Report data seeding completed successfully!');
    console.log('\nSample data created:');
    console.log(`- ${categories.length} categories`);
    console.log(`- ${suppliers.length} suppliers`);
    console.log(`- ${products.length} products`);
    console.log(`- ${customers.length} customers`);
    console.log(`- ${createdOrders.length} orders`);
    console.log('\nYou can now test the reports with this sample data.');

  } catch (error) {
    console.error('❌ Error seeding report data:', error);
    throw error;
  }
};

module.exports = seedReportData;

// Run seeder if called directly
if (require.main === module) {
  const connectDB = require('../config/db');
  
  connectDB().then(async () => {
    await seedReportData();
    process.exit(0);
  }).catch(error => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });
}