/**
 * Device Fingerprint Model
 * 
 * Stores unique device characteristics for Zero-Trust verification
 * Tracks device behavior, trust scores, and risk factors
 */

const mongoose = require('mongoose');

const deviceFingerprintSchema = new mongoose.Schema({
  fingerprintHash: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  deviceInfo: {
    browser: { type: String, required: true },
    os: { type: String, required: true },
    deviceType: { type: String, required: true },
    isMobile: { type: Boolean, default: false },
    isBot: { type: Boolean, default: false }
  },
  
  // Trust and verification status
  trustScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  isVerified: {
    type: Boolean,
    default: false
  },
  
  verificationMethod: {
    type: String,
    enum: ['EMAIL', 'SMS', 'ADMIN_APPROVAL', 'BEHAVIORAL_ANALYSIS'],
    default: null
  },
  
  verifiedAt: {
    type: Date,
    default: null
  },
  
  // Usage tracking
  firstSeen: {
    type: Date,
    required: true,
    default: Date.now
  },
  
  lastSeen: {
    type: Date,
    required: true,
    default: Date.now
  },
  
  accessCount: {
    type: Number,
    default: 1
  },
  
  // Network information
  ipAddresses: [{
    type: String,
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
  }],
  
  geoLocations: [{
    country: String,
    region: String,
    city: String,
    latitude: Number,
    longitude: Number,
    timezone: String,
    isp: String,
    org: String,
    as: String,
    query: String,
    timestamp: { type: Date, default: Date.now }
  }],
  
  // Risk assessment
  riskFactors: [{
    type: String,
    enum: [
      'NEW_DEVICE',
      'SUSPICIOUS_LOCATION',
      'BOT_DETECTED',
      'VPN_PROXY',
      'RAPID_REQUESTS',
      'FAILED_ATTEMPTS',
      'UNUSUAL_HOURS',
      'SUSPICIOUS_USER_AGENT',
      'MISSING_HEADERS',
      'HIGH_RISK_COUNTRY'
    ]
  }],
  
  riskScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  lastRiskAssessment: {
    type: Date,
    default: Date.now
  },
  
  // Security events
  securityEvents: [{
    eventType: {
      type: String,
      enum: ['LOGIN_SUCCESS', 'LOGIN_FAILED', 'ACCESS_DENIED', 'SUSPICIOUS_ACTIVITY'],
      required: true
    },
    timestamp: { type: Date, default: Date.now },
    ipAddress: String,
    riskScore: Number,
    details: mongoose.Schema.Types.Mixed
  }],
  
  // Behavioral patterns
  behaviorProfile: {
    typicalAccessHours: [Number], // Array of hours (0-23)
    typicalDaysOfWeek: [Number], // Array of days (0-6)
    averageSessionDuration: Number, // in minutes
    commonEndpoints: [String],
    requestFrequency: Number, // requests per minute
    lastUpdated: { type: Date, default: Date.now }
  },
  
  // Administrative controls
  isBlocked: {
    type: Boolean,
    default: false
  },
  
  blockedReason: String,
  
  blockedAt: Date,
  
  blockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Associated users
  associatedUsers: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    firstAssociation: { type: Date, default: Date.now },
    lastAssociation: { type: Date, default: Date.now },
    accessCount: { type: Number, default: 1 }
  }],
  
  // Metadata
  notes: String,
  
  tags: [String]
  
}, {
  timestamps: true
});

// Indexes for performance
deviceFingerprintSchema.index({ fingerprintHash: 1 });
deviceFingerprintSchema.index({ trustScore: -1 });
deviceFingerprintSchema.index({ lastSeen: -1 });
deviceFingerprintSchema.index({ isVerified: 1 });
deviceFingerprintSchema.index({ isBlocked: 1 });
deviceFingerprintSchema.index({ 'ipAddresses': 1 });
deviceFingerprintSchema.index({ 'geoLocations.country': 1 });

// Methods
deviceFingerprintSchema.methods.updateTrustScore = function() {
  let score = 0;
  
  // Base score for verified devices
  if (this.isVerified) {
    score += 30;
  }
  
  // Age bonus (older devices are more trusted)
  const ageInDays = (Date.now() - this.firstSeen.getTime()) / (1000 * 60 * 60 * 24);
  score += Math.min(20, ageInDays * 2);
  
  // Usage frequency bonus
  if (this.accessCount > 100) {
    score += 20;
  } else if (this.accessCount > 50) {
    score += 15;
  } else if (this.accessCount > 10) {
    score += 10;
  }
  
  // Consistent location bonus
  if (this.geoLocations.length <= 3) {
    score += 15;
  }
  
  // No recent security events bonus
  const recentEvents = this.securityEvents.filter(event => 
    Date.now() - event.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000 // 7 days
  );
  
  if (recentEvents.length === 0) {
    score += 15;
  }
  
  // Penalty for risk factors
  score -= this.riskFactors.length * 5;
  
  // Ensure score is within bounds
  this.trustScore = Math.max(0, Math.min(100, score));
  
  return this.trustScore;
};

deviceFingerprintSchema.methods.addSecurityEvent = function(eventType, details = {}) {
  this.securityEvents.push({
    eventType,
    timestamp: new Date(),
    ipAddress: details.ipAddress,
    riskScore: details.riskScore,
    details
  });
  
  // Keep only last 50 events
  if (this.securityEvents.length > 50) {
    this.securityEvents = this.securityEvents.slice(-50);
  }
  
  // Update trust score
  this.updateTrustScore();
};

deviceFingerprintSchema.methods.updateBehaviorProfile = function(requestData) {
  const now = new Date();
  const hour = now.getHours();
  const dayOfWeek = now.getDay();
  
  if (!this.behaviorProfile.typicalAccessHours) {
    this.behaviorProfile.typicalAccessHours = [];
  }
  
  if (!this.behaviorProfile.typicalDaysOfWeek) {
    this.behaviorProfile.typicalDaysOfWeek = [];
  }
  
  if (!this.behaviorProfile.commonEndpoints) {
    this.behaviorProfile.commonEndpoints = [];
  }
  
  // Update typical access hours
  if (!this.behaviorProfile.typicalAccessHours.includes(hour)) {
    this.behaviorProfile.typicalAccessHours.push(hour);
  }
  
  // Update typical days of week
  if (!this.behaviorProfile.typicalDaysOfWeek.includes(dayOfWeek)) {
    this.behaviorProfile.typicalDaysOfWeek.push(dayOfWeek);
  }
  
  // Update common endpoints
  if (requestData.endpoint && !this.behaviorProfile.commonEndpoints.includes(requestData.endpoint)) {
    this.behaviorProfile.commonEndpoints.push(requestData.endpoint);
    
    // Keep only top 20 endpoints
    if (this.behaviorProfile.commonEndpoints.length > 20) {
      this.behaviorProfile.commonEndpoints = this.behaviorProfile.commonEndpoints.slice(-20);
    }
  }
  
  this.behaviorProfile.lastUpdated = now;
};

// Static methods
deviceFingerprintSchema.statics.findByFingerprint = function(fingerprintHash) {
  return this.findOne({ fingerprintHash });
};

deviceFingerprintSchema.statics.findHighRiskDevices = function(riskThreshold = 70) {
  return this.find({ 
    riskScore: { $gte: riskThreshold },
    isBlocked: false 
  }).sort({ riskScore: -1 });
};

deviceFingerprintSchema.statics.findUnverifiedDevices = function(daysOld = 7) {
  const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
  return this.find({
    isVerified: false,
    firstSeen: { $lte: cutoffDate }
  }).sort({ firstSeen: 1 });
};

// Pre-save middleware
deviceFingerprintSchema.pre('save', function(next) {
  // Update access count
  if (this.isModified('lastSeen')) {
    this.accessCount += 1;
  }
  
  // Update trust score if risk factors changed
  if (this.isModified('riskFactors') || this.isModified('isVerified')) {
    this.updateTrustScore();
  }
  
  next();
});

module.exports = mongoose.model('DeviceFingerprint', deviceFingerprintSchema);