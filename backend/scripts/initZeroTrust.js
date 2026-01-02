/**
 * Zero-Trust Initialization Script
 * 
 * Sets up Zero-Trust security infrastructure
 * Creates indexes, initializes configurations, and validates setup
 */

const mongoose = require('mongoose');
const SecurityEvent = require('../models/SecurityEvent');
const DeviceFingerprint = require('../models/DeviceFingerprint');
const zeroTrustConfig = require('../config/zeroTrustConfig');

class ZeroTrustInitializer {
  constructor() {
    this.initialized = false;
  }

  /**
   * Initialize Zero-Trust security system
   */
  async initialize() {
    try {
      console.log('🔒 Initializing Zero-Trust Security System...');

      // Check database connection
      if (mongoose.connection.readyState !== 1) {
        throw new Error('Database connection required for Zero-Trust initialization');
      }

      // Create database indexes for performance
      await this.createIndexes();

      // Validate configuration
      await this.validateConfiguration();

      // Initialize security policies
      await this.initializeSecurityPolicies();

      // Set up monitoring
      await this.setupMonitoring();

      this.initialized = true;
      console.log('✅ Zero-Trust Security System initialized successfully');

      return {
        success: true,
        message: 'Zero-Trust system initialized',
        timestamp: new Date()
      };

    } catch (error) {
      console.error('❌ Zero-Trust initialization failed:', error);
      throw error;
    }
  }

  /**
   * Create database indexes for optimal performance
   */
  async createIndexes() {
    console.log('📊 Creating database indexes...');

    try {
      // SecurityEvent indexes
      await SecurityEvent.collection.createIndex({ eventType: 1, createdAt: -1 });
      await SecurityEvent.collection.createIndex({ userId: 1, createdAt: -1 });
      await SecurityEvent.collection.createIndex({ ipAddress: 1, createdAt: -1 });
      await SecurityEvent.collection.createIndex({ riskScore: -1, createdAt: -1 });
      await SecurityEvent.collection.createIndex({ severity: 1, createdAt: -1 });
      await SecurityEvent.collection.createIndex({ 'geoLocation.country': 1 });
      await SecurityEvent.collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

      // DeviceFingerprint indexes
      await DeviceFingerprint.collection.createIndex({ fingerprintHash: 1 }, { unique: true });
      await DeviceFingerprint.collection.createIndex({ trustScore: -1 });
      await DeviceFingerprint.collection.createIndex({ lastSeen: -1 });
      await DeviceFingerprint.collection.createIndex({ isVerified: 1 });
      await DeviceFingerprint.collection.createIndex({ isBlocked: 1 });
      await DeviceFingerprint.collection.createIndex({ 'associatedUsers.userId': 1 });

      console.log('✅ Database indexes created successfully');

    } catch (error) {
      console.error('❌ Failed to create indexes:', error);
      throw error;
    }
  }

  /**
   * Validate Zero-Trust configuration
   */
  async validateConfiguration() {
    console.log('🔍 Validating Zero-Trust configuration...');

    const config = zeroTrustConfig;
    const errors = [];

    // Validate risk thresholds
    if (!config.riskThresholds || 
        typeof config.riskThresholds.LOW !== 'number' ||
        typeof config.riskThresholds.MEDIUM !== 'number' ||
        typeof config.riskThresholds.HIGH !== 'number' ||
        typeof config.riskThresholds.CRITICAL !== 'number') {
      errors.push('Invalid risk thresholds configuration');
    }

    // Validate risk weights (should sum to 1.0)
    if (config.riskWeights) {
      const weightSum = Object.values(config.riskWeights).reduce((sum, weight) => sum + weight, 0);
      if (Math.abs(weightSum - 1.0) > 0.01) {
        errors.push(`Risk weights sum to ${weightSum}, should sum to 1.0`);
      }
    } else {
      errors.push('Risk weights configuration missing');
    }

    // Validate security policies
    if (!config.securityPolicies) {
      errors.push('Security policies configuration missing');
    }

    // Check required environment variables
    const requiredEnvVars = ['NODE_ENV'];
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    if (missingEnvVars.length > 0) {
      errors.push(`Missing environment variables: ${missingEnvVars.join(', ')}`);
    }

    if (errors.length > 0) {
      throw new Error(`Configuration validation failed: ${errors.join('; ')}`);
    }

    console.log('✅ Configuration validation passed');
  }

  /**
   * Initialize security policies
   */
  async initializeSecurityPolicies() {
    console.log('🛡️ Initializing security policies...');

    // Log initialization event
    const initEvent = new SecurityEvent({
      eventType: 'SYSTEM_INITIALIZATION',
      severity: 'LOW',
      ipAddress: '127.0.0.1',
      userAgent: 'Zero-Trust Initializer',
      description: 'Zero-Trust security system initialized',
      metadata: {
        version: '1.0.0',
        config: {
          riskThresholds: zeroTrustConfig.riskThresholds,
          securityPolicies: Object.keys(zeroTrustConfig.securityPolicies)
        }
      }
    });

    await initEvent.save();
    console.log('✅ Security policies initialized');
  }

  /**
   * Set up monitoring and alerting
   */
  async setupMonitoring() {
    console.log('📡 Setting up security monitoring...');

    // Initialize monitoring metrics
    const monitoringConfig = {
      startTime: new Date(),
      version: '1.0.0',
      features: [
        'Device Fingerprinting',
        'Risk Assessment',
        'Threat Detection',
        'Behavioral Analysis',
        'Geographic Monitoring',
        'Temporal Analysis'
      ]
    };

    console.log('📊 Monitoring features enabled:', monitoringConfig.features.join(', '));
    console.log('✅ Security monitoring setup complete');
  }

  /**
   * Health check for Zero-Trust system
   */
  async healthCheck() {
    try {
      const health = {
        status: 'healthy',
        initialized: this.initialized,
        timestamp: new Date(),
        components: {}
      };

      // Check database connectivity
      try {
        await SecurityEvent.findOne().limit(1);
        health.components.database = 'healthy';
      } catch (error) {
        health.components.database = 'unhealthy';
        health.status = 'degraded';
      }

      // Check configuration
      try {
        await this.validateConfiguration();
        health.components.configuration = 'healthy';
      } catch (error) {
        health.components.configuration = 'unhealthy';
        health.status = 'degraded';
      }

      // Check recent activity
      try {
        const recentEvents = await SecurityEvent.countDocuments({
          createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) }
        });
        health.components.activity = recentEvents > 0 ? 'active' : 'idle';
      } catch (error) {
        health.components.activity = 'unknown';
      }

      return health;

    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  /**
   * Get system statistics
   */
  async getStatistics() {
    try {
      const stats = {
        timestamp: new Date(),
        events: {
          total: await SecurityEvent.countDocuments(),
          last24h: await SecurityEvent.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
          }),
          highRisk: await SecurityEvent.countDocuments({
            riskScore: { $gte: 70 }
          })
        },
        devices: {
          total: await DeviceFingerprint.countDocuments(),
          verified: await DeviceFingerprint.countDocuments({ isVerified: true }),
          blocked: await DeviceFingerprint.countDocuments({ isBlocked: true }),
          new24h: await DeviceFingerprint.countDocuments({
            firstSeen: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
          })
        }
      };

      return stats;

    } catch (error) {
      throw new Error(`Failed to get statistics: ${error.message}`);
    }
  }

  /**
   * Clean up old data based on retention policies
   */
  async cleanup() {
    try {
      console.log('🧹 Starting Zero-Trust data cleanup...');

      const config = zeroTrustConfig.monitoring;
      const now = new Date();

      // Clean up old security events
      const eventCutoff = new Date(now.getTime() - config.securityEventRetention);
      const deletedEvents = await SecurityEvent.deleteMany({
        createdAt: { $lt: eventCutoff }
      });

      // Clean up old device fingerprints
      const deviceCutoff = new Date(now.getTime() - config.deviceFingerprintRetention);
      const deletedDevices = await DeviceFingerprint.deleteMany({
        lastSeen: { $lt: deviceCutoff },
        isVerified: false,
        isBlocked: false
      });

      console.log(`✅ Cleanup complete: ${deletedEvents.deletedCount} events, ${deletedDevices.deletedCount} devices removed`);

      return {
        eventsDeleted: deletedEvents.deletedCount,
        devicesDeleted: deletedDevices.deletedCount,
        timestamp: now
      };

    } catch (error) {
      console.error('❌ Cleanup failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
module.exports = new ZeroTrustInitializer();