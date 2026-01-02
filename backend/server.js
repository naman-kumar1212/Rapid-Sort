/**
 * Inventory Management API - Express Server
 *
 * Node.js runs JavaScript on the server (outside the browser). Unlike browsers,
 * Node.js provides access to the filesystem, network sockets, environment
 * variables, and processes. Browsers provide the DOM and Web APIs (like
 * window, document, fetch) but prevent direct disk or raw socket access for
 * security. Here we use Node.js to serve a REST API using Express.
 *
 * Module systems:
 * - This project uses CommonJS (require/module.exports). See "type": "commonjs"
 *   in backend/package.json. You could also use ESM (import/export) by setting
 *   "type": "module" and updating imports accordingly.
 *
 * Running the app:
 * - Development: npm run dev (nodemon restarts the server on file changes)
 * - Production:  npm start
 * See scripts in backend/package.json and the monorepo root package.json.
 */
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const http = require('http');
const productRoutes = require('./routes/productRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const zeroTrustMiddleware = require('./middleware/zeroTrustMiddleware');
const zeroTrustInitializer = require('./scripts/initZeroTrust');

// Load environment variables
dotenv.config();

// Import WebSocket configuration
const { initializeWebSocket } = require('./config/websocket');

// Track which data store we are using (MongoDB vs in-memory fallback)
let dbStatus = 'memory';
let dbMessage = 'Using in-memory storage (data will not persist)';

// Try to connect to MongoDB, fall back to in-memory storage if not available
// Demonstrates async module usage and error handling around startup.
try {
  const connectDB = require('./config/db');
  connectDB().then(async () => {
    dbStatus = 'mongodb';
    dbMessage = 'Connected to MongoDB (data will persist)';
    console.log('✅ Using MongoDB for data storage');
    
    // Initialize Zero-Trust security system
    try {
      await zeroTrustInitializer.initialize();
    } catch (error) {
      console.error('⚠️  Zero-Trust initialization failed:', error.message);
      console.log('💡 Zero-Trust will operate with default settings');
    }
  }).catch(() => {
    console.log('⚠️  MongoDB not available, using in-memory storage');
    console.log('💡 Install and start MongoDB for persistent data storage');
  });
} catch (error) {
  console.log('⚠️  MongoDB not available, using in-memory storage');
  console.log('💡 Install and start MongoDB for persistent data storage');
}

const app = express();

// Express middleware stack
// - express.json/urlencoded parse incoming JSON/form bodies
// - cors enables Cross-Origin Resource Sharing (browser -> server)
// - morgan logs HTTP requests (useful for debugging)
// - Zero-Trust security middleware for continuous verification
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());
app.use(morgan('combined'));

// Zero-Trust Security Layer - Applied to all routes
// This middleware implements "Never Trust, Always Verify" architecture
app.use('/api', zeroTrustMiddleware.verifyTrust);

// Serve static files (e.g., user avatar uploads) from the "uploads" folder
app.use('/uploads', express.static('uploads'));

// RESTful route mounting. Each router defines endpoints for its resource.
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', productRoutes);
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/suppliers', require('./routes/supplierRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/zero-trust', require('./routes/zeroTrustRoutes'));

// Health check route
app.get('/api/health', async (req, res) => {
  try {
    // Get Zero-Trust health status
    const zeroTrustHealth = await zeroTrustInitializer.healthCheck();
    const { getConnectedClients } = require('./config/websocket');
    
    res.status(200).json({
      success: true,
      message: 'Inventory Management API is running',
      database: {
        type: dbStatus,
        status: dbMessage,
        connected: dbStatus === 'mongodb'
      },
      features: {
        websocket: {
          enabled: process.env.ENABLE_WEBSOCKET !== 'false',
          connectedClients: getConnectedClients ? getConnectedClients() : 0
        },
        zeroTrust: {
          status: zeroTrustHealth.status,
          initialized: zeroTrustHealth.initialized,
          components: zeroTrustHealth.components
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      message: 'Inventory Management API is running',
      database: {
        type: dbStatus,
        status: dbMessage
      },
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Centralized error handler must be mounted LAST so it sees errors from routes.
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

// Create HTTP server (required for WebSocket)
const httpServer = http.createServer(app);

// Initialize WebSocket if enabled
if (process.env.ENABLE_WEBSOCKET !== 'false') {
  try {
    initializeWebSocket(httpServer);
    console.log('✅ WebSocket server initialized');
  } catch (error) {
    console.log('⚠️  WebSocket initialization failed:', error.message);
  }
}

const server = httpServer.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log('='.repeat(60));
  console.log(`\n📡 API Endpoints:`);
  console.log(`   Health Check: http://localhost:${PORT}/api/health`);
  console.log(`   Products API: http://localhost:${PORT}/api/products`);
  
  if (process.env.ENABLE_WEBSOCKET !== 'false') {
    console.log(`\n🔌 WebSocket:`);
    console.log(`   ws://localhost:${PORT}/ws?token=YOUR_JWT_TOKEN`);
  }
  
  console.log(`\n📱 Frontend Connection:`);
  console.log(`   http://localhost:${PORT}/api`);
  console.log(`\n🌐 Server listening on all interfaces`);
  console.log('='.repeat(60) + '\n');
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.log(`💡 Port ${PORT} is already in use. Try a different port:`);
    console.log(`   set PORT=5001 && npm start`);
  }
});

// Process-level safety nets and graceful shutdown
// - uncaughtException: synchronous errors not caught anywhere
// - unhandledRejection: rejected promises without a catch
// We log the stack trace for debugging and close the server to finish inflight requests.
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.stack || err);
  server?.close(() => process.exit(1));
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  server?.close(() => process.exit(1));
});

// Graceful shutdown on SIGTERM (e.g., from process managers or cloud platforms)
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});