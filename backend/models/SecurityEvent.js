/**
 * Security Event Model
 * 
 * Comprehensive logging for Zero-Trust security events
 * Tracks all security-related activities for audit and analysis
 */

const mongoose = require('mongoose');

const securityEventSchema = new mongoose.Schema({
  // Event identification
  eventId: {
    type: String,
    unique: true,
    default: () => require('crypto').randomBytes(16).toString('hex')
  },
  
  eventType: {
    type: String,
    required: true,
    enum: [
      // Authentication events
      'LOGIN_SUCCESS',
      'LOGIN_FAILED',
      'LOGOUT',
      'PASSWORD_CHANGE',
      'PASSWORD_RESET_REQUEST',
      'PASSWORD_RESET_SUCCESS',
      'MFA_CHALLENGE',
      'MFA_SUCCESS',
      'MFA_FAILED',
      
      // Authorization events
      'ACCESS_GRANTED',
      'ACCESS_DENIED',
      'PRIVILEGE_ESCALATION',
      'ROLE_CHANGE',
      
      // Zero-Trust events
      'ZERO_TRUST_VERIFICATION',
      'DEVICE_FINGERPRINT_NEW',
      'DEVICE_FINGERPRINT_CHANGED',
      'RISK_ASSESSMENT',
      'TRUST_LEVEL_CHANGE',
      
      // Suspicious activities
      'SUSPICIOUS_ACTIVITY',
      'BRUTE_FORCE_ATTEMPT',
      'RATE_LIMIT_EXCEEDED',
      'ANOMALOUS_BEHAVIOR',
      'GEO_ANOMALY',
      'TIME_ANOMALY',
      
      // API events
      'API_REQUEST',
      'API_ERROR',
      'DATA_ACCESS',
      'DATA_MODIFICATION',
      'BULK_OPERATION',
      
      // System events
      'SYSTEM_ERROR',
      'SYSTEM_INITIALIZATION',
      'CONFIGURATION_CHANGE',
      'SECURITY_POLICY_VIOLATION',
      'THREAT_DETECTED'
    ]
  },
  
  // Severity level
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'LOW'
  },
  
  // User information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  userEmail: String,
  userRole: String,
  
  // Request information
  ipAddress: {
    type: String,
    required: true,
    validate: {
      validator: function(ip) {
        // IPv4 validation (including localhost 127.0.0.1)
        const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        
        // IPv6 validation (including compressed forms like ::1)
        const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$|^([0-9a-fA-F]{1,4}:){1,7}:$|^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$/;
        
        // IPv4-mapped IPv6 addresses (like ::ffff:127.0.0.1)
        const ipv4MappedRegex = /^::ffff:(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        
        // Allow common localhost addresses and variations
        const localhostVariations = [
          '::1', 
          '127.0.0.1', 
          'localhost',
          '::ffff:127.0.0.1',
          '0:0:0:0:0:0:0:1'
        ];
        
        if (localhostVariations.includes(ip)) {
          return true;
        }
        
        return ipv4Regex.test(ip) || ipv6Regex.test(ip) || ipv4MappedRegex.test(ip);
      },
      message: 'Invalid IP address format'
    }
  },
  
  userAgent: String,
  
  requestMethod: String,
  requestPath: String,
  requestHeaders: mongoose.Schema.Types.Mixed,
  
  // Geographic information
  geoLocation: {
    country: String,
    region: String,
    city: String,
    latitude: Number,
    longitude: Number,
    timezone: String,
    isp: String,
    org: String,
    as: String
  },
  
  // Device information
  deviceFingerprint: {
    hash: String,
    browser: String,
    os: String,
    deviceType: String,
    isMobile: Boolean,
    isBot: Boolean
  },
  
  // Risk assessment
  riskScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  
  riskFactors: [{
    factor: String,
    score: Number,
    description: String
  }],
  
  trustLevel: {
    type: String,
    enum: ['NONE', 'LOW', 'MEDIUM', 'HIGH'],
    default: 'LOW'
  },
  
  // Security decision
  securityDecision: {
    type: String,
    enum: ['ALLOW', 'DENY', 'CHALLENGE'],
    default: 'ALLOW'
  },
  
  securityAction: {
    type: String,
    enum: [
      'NONE',
      'LOG_ONLY',
      'RATE_LIMIT',
      'REQUIRE_MFA',
      'BLOCK_IP',
      'BLOCK_USER',
      'ALERT_ADMIN',
      'QUARANTINE_SESSION'
    ],
    default: 'NONE'
  },
  
  // Event details
  description: String,
  
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Response information
  responseStatus: Number,
  responseTime: Number, // in milliseconds
  
  // Error information
  errorCode: String,
  errorMessage: String,
  stackTrace: String,
  
  // Session information
  sessionId: String,
  sessionDuration: Number, // in seconds
  
  // Correlation
  correlationId: String, // For tracking related events
  parentEventId: String, // For event chains
  
  // Processing status
  processed: {
    type: Boolean,
    default: false
  },
  
  processedAt: Date,
  
  alertSent: {
    type: Boolean,
    default: false
  },
  
  alertSentAt: Date,
  
  // Retention
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
  }
  
}, {
  timestamps: true
});

// Indexes for performance and queries
securityEventSchema.index({ eventType: 1, createdAt: -1 });
securityEventSchema.index({ userId: 1, createdAt: -1 });
securityEventSchema.index({ ipAddress: 1, createdAt: -1 });
securityEventSchema.index({ severity: 1, createdAt: -1 });
securityEventSchema.index({ riskScore: -1, createdAt: -1 });
securityEventSchema.index({ securityDecision: 1, createdAt: -1 });
securityEventSchema.index({ processed: 1, createdAt: -1 });
securityEventSchema.index({ correlationId: 1 });
securityEventSchema.index({ 'geoLocation.country': 1 });
securityEventSchema.index({ 'deviceFingerprint.hash': 1 });
securityEventSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for event age
securityEventSchema.virtual('ageInMinutes').get(function() {
  return Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60));
});

// Methods
securityEventSchema.methods.markAsProcessed = function() {
  this.processed = true;
  this.processedAt = new Date();
  return this.save();
};

securityEventSchema.methods.sendAlert = function() {
  this.alertSent = true;
  this.alertSentAt = new Date();
  return this.save();
};

securityEventSchema.methods.addCorrelation = function(correlationId) {
  this.correlationId = correlationId;
  return this.save();
};

// Static methods
securityEventSchema.statics.findByUser = function(userId, limit = 100) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

securityEventSchema.statics.findByIP = function(ipAddress, hours = 24) {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);
  return this.find({ 
    ipAddress, 
    createdAt: { $gte: since } 
  }).sort({ createdAt: -1 });
};

securityEventSchema.statics.findHighRiskEvents = function(riskThreshold = 70, hours = 24) {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);
  return this.find({
    riskScore: { $gte: riskThreshold },
    createdAt: { $gte: since }
  }).sort({ riskScore: -1, createdAt: -1 });
};

securityEventSchema.statics.findSuspiciousActivity = function(hours = 24) {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);
  return this.find({
    eventType: { $in: ['SUSPICIOUS_ACTIVITY', 'BRUTE_FORCE_ATTEMPT', 'ANOMALOUS_BEHAVIOR'] },
    createdAt: { $gte: since }
  }).sort({ createdAt: -1 });
};

securityEventSchema.statics.findFailedLogins = function(ipAddress, hours = 1) {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);
  return this.countDocuments({
    eventType: 'LOGIN_FAILED',
    ipAddress,
    createdAt: { $gte: since }
  });
};

securityEventSchema.statics.getSecuritySummary = function(hours = 24) {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);
  
  return this.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: '$eventType',
        count: { $sum: 1 },
        avgRiskScore: { $avg: '$riskScore' },
        maxRiskScore: { $max: '$riskScore' },
        severityBreakdown: {
          $push: '$severity'
        }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

securityEventSchema.statics.getGeoDistribution = function(hours = 24) {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);
  
  return this.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: {
          country: '$geoLocation.country',
          city: '$geoLocation.city'
        },
        count: { $sum: 1 },
        uniqueUsers: { $addToSet: '$userId' },
        avgRiskScore: { $avg: '$riskScore' }
      }
    },
    {
      $project: {
        country: '$_id.country',
        city: '$_id.city',
        count: 1,
        uniqueUserCount: { $size: '$uniqueUsers' },
        avgRiskScore: { $round: ['$avgRiskScore', 2] }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

// Pre-save middleware
securityEventSchema.pre('save', function(next) {
  // Set severity based on risk score and event type
  if (!this.severity || this.severity === 'LOW') {
    if (this.riskScore >= 90) {
      this.severity = 'CRITICAL';
    } else if (this.riskScore >= 70) {
      this.severity = 'HIGH';
    } else if (this.riskScore >= 40) {
      this.severity = 'MEDIUM';
    }
    
    // Override based on event type
    const criticalEvents = ['BRUTE_FORCE_ATTEMPT', 'PRIVILEGE_ESCALATION', 'THREAT_DETECTED'];
    const highEvents = ['LOGIN_FAILED', 'ACCESS_DENIED', 'SUSPICIOUS_ACTIVITY'];
    
    if (criticalEvents.includes(this.eventType)) {
      this.severity = 'CRITICAL';
    } else if (highEvents.includes(this.eventType)) {
      this.severity = 'HIGH';
    }
  }
  
  // Set user information from populated user
  if (this.userId && this.populated('userId')) {
    this.userEmail = this.userId.email;
    this.userRole = this.userId.role;
  }
  
  next();
});

module.exports = mongoose.model('SecurityEvent', securityEventSchema);