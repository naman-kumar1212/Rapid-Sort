/**
 * WebSocket Configuration for Real-time Communication
 * 
 * WebSocket provides full-duplex communication channels over a single TCP connection
 * Use cases:
 * - Real-time inventory updates
 * - Live notifications
 * - Collaborative features
 * - Live dashboard updates
 */
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let wss = null;
const clients = new Map(); // Store authenticated clients

/**
 * Initialize WebSocket server
 * @param {Object} server - HTTP server instance
 */
const initializeWebSocket = (server) => {
  wss = new WebSocket.Server({
    server,
    path: '/ws'
  });

  wss.on('connection', async (ws, req) => {
    console.log('🔌 New WebSocket connection attempt');

    // Extract token from query string or headers
    const token = extractToken(req);

    if (!token) {
      ws.close(1008, 'Authentication required');
      return;
    }

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        ws.close(1008, 'Invalid user');
        return;
      }

      // Store authenticated client
      const clientId = user._id.toString();
      clients.set(clientId, { ws, user });

      console.log(`✅ WebSocket authenticated: ${user.email}`);

      // Send welcome message
      ws.send(JSON.stringify({
        type: 'connection',
        message: 'Connected to real-time updates',
        user: {
          id: user._id,
          email: user.email,
          role: user.role
        }
      }));

      // Handle incoming messages
      ws.on('message', (message) => {
        handleMessage(clientId, message);
      });

      // Handle disconnection
      ws.on('close', () => {
        clients.delete(clientId);
        console.log(`🔌 WebSocket disconnected: ${user.email}`);
      });

      // Handle errors
      ws.on('error', (error) => {
        console.error('WebSocket error:', error.message);
        clients.delete(clientId);
      });

    } catch (error) {
      console.error('WebSocket authentication error:', error.message);
      ws.close(1008, 'Authentication failed');
    }
  });

  console.log('✅ WebSocket server initialized on /ws');
};

/**
 * Extract token from request
 */
const extractToken = (req) => {
  // Try query parameter
  const url = new URL(req.url, `http://${req.headers.host}`);
  const tokenFromQuery = url.searchParams.get('token');
  if (tokenFromQuery) return tokenFromQuery;

  // Try Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
};

/**
 * Handle incoming WebSocket messages
 */
const handleMessage = (clientId, message) => {
  try {
    const data = JSON.parse(message);
    console.log(`📨 Message from ${clientId}:`, data.type);

    // Handle different message types
    switch (data.type) {
      case 'ping':
        sendToClient(clientId, { type: 'pong', timestamp: Date.now() });
        break;
      case 'subscribe':
        // Handle subscription to specific channels
        handleSubscription(clientId, data.channel);
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  } catch (error) {
    console.error('Error handling message:', error.message);
  }
};

/**
 * Handle channel subscriptions
 */
const handleSubscription = (clientId, channel) => {
  const client = clients.get(clientId);
  if (!client) return;

  if (!client.subscriptions) {
    client.subscriptions = new Set();
  }
  client.subscriptions.add(channel);

  sendToClient(clientId, {
    type: 'subscribed',
    channel,
    message: `Subscribed to ${channel}`
  });
};

/**
 * Send message to specific client
 */
const sendToClient = (clientId, data) => {
  const client = clients.get(clientId);
  if (client && client.ws.readyState === WebSocket.OPEN) {
    client.ws.send(JSON.stringify(data));
  }
};

/**
 * Broadcast message to all connected clients
 */
const broadcast = (data, filter = null) => {
  const message = JSON.stringify(data);
  let sentCount = 0;

  clients.forEach((client, clientId) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      // Apply filter if provided
      if (!filter || filter(client.user)) {
        client.ws.send(message);
        sentCount++;
      }
    }
  });

  console.log(`📡 Broadcast sent to ${sentCount} clients`);
  return sentCount;
};

/**
 * Broadcast to specific channel subscribers
 */
const broadcastToChannel = (channel, data) => {
  const message = JSON.stringify(data);
  let sentCount = 0;

  clients.forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN &&
      client.subscriptions &&
      client.subscriptions.has(channel)) {
      client.ws.send(message);
      sentCount++;
    }
  });

  console.log(`📡 Broadcast to channel '${channel}': ${sentCount} clients`);
  return sentCount;
};

/**
 * Notify about inventory changes
 */
const notifyInventoryUpdate = (product) => {
  broadcast({
    type: 'inventory_update',
    data: product,
    timestamp: new Date().toISOString()
  });
};

/**
 * Notify about new orders
 */
const notifyNewOrder = (order) => {
  broadcast({
    type: 'new_order',
    data: order,
    timestamp: new Date().toISOString()
  }, (user) => ['admin', 'manager'].includes(user.role));
};

/**
 * Notify about low stock
 */
const notifyLowStock = (product) => {
  broadcast({
    type: 'low_stock_alert',
    data: product,
    timestamp: new Date().toISOString()
  }, (user) => ['admin', 'manager'].includes(user.role) || user.department === 'inventory');
};

/**
 * Get connected clients count
 */
const getConnectedClients = () => {
  return clients.size;
};

/**
 * Get WebSocket server instance
 */
const getWebSocketServer = () => wss;

module.exports = {
  initializeWebSocket,
  broadcast,
  broadcastToChannel,
  sendToClient,
  notifyInventoryUpdate,
  notifyNewOrder,
  notifyLowStock,
  getConnectedClients,
  getWebSocketServer
};
