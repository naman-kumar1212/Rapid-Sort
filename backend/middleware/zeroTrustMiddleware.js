/**
 * Zero-Trust Security Middleware
 * 
 * Implements "Never Trust, Always Verify" architecture with:
 * - Device fingerprinting and verification
 * - Continuous authentication and authorization
 * - Risk-based access control
 * - Behavioral analysis and anomaly detection
 * - Geographic and temporal access patterns
 * - Session integrity monitoring
 */

const crypto = require('crypto');
const DeviceFingerprint = require('../models/DeviceFingerprint');
const SecurityEvent = require('../models/SecurityEvent');
const RiskAssessment = require('../utils/riskAssessment');
const ThreatDetection = require('../utils/threatDetection');

// Optional geoip-lite dependency - gracefully handle if not installed
let geoip = null;
try {
  geoip = require('geoip-lite');
} catch (error) {
  console.warn('⚠️  geoip-lite not installed. Geographic features will be limited.');
  console.log('💡 Install with: npm install geoip-lite');
}

class ZeroTrustMiddleware {
  constructor() {
    this.riskThresholds = {
      LOW: 25,
      MEDIUM: 50,
      HIGH: 75,
      CRITICAL: 90
    };
    
    this.securityPolicies = {
      maxFailedAttempts: 5,
      sessionTimeout: 30 * 60 * 1000, // 30 minutes
      deviceTrustDuration: 7 * 24 * 60 * 60 * 1000, // 7 days
      geoFenceRadius: 100, // km
      maxConcurrentSessions: 3
    };
  }

  /**
   * Main Zero-Trust verification middleware
   */
  verifyTrust = async (req, res, next) => {
    try {
      console.log('🔒 Zero-Trust: Starting verification process');
      
      // Extract request context
      const context = this.extractRequestContext(req);
      
      // Generate or verify device fingerprint
      const deviceFingerprint = await this.verifyDeviceFingerprint(context);
      
      // Perform risk assessment
      const riskScore = await this.assessRisk(context, deviceFingerprint, req.user);
      
      // Apply security policies based on risk
      const securityDecision = await this.makeSecurityDecision(riskScore, context, req.user);
      
      // Log security event
      await this.logSecurityEvent(context, riskScore, securityDecision, req.user);
      
      // Attach security context to request
      req.zeroTrust = {
        deviceFingerprint,
        riskScore,
        securityDecision,
        context,
        trustLevel: this.calculateTrustLevel(riskScore)
      };
      
      // Handle security decision
      if (securityDecision.action === 'DENY') {
        return res.status(403).json({
          success: false,
          message: 'Access denied by Zero-Trust policy',
          reason: securityDecision.reason,
          riskScore: riskScore.total,
          requiresAdditionalAuth: securityDecision.requiresAdditionalAuth
        });
      }
      
      if (securityDecision.action === 'CHALLENGE') {
        return res.status(202).json({
          success: false,
          message: 'Additional authentication required',
          challengeType: securityDecision.challengeType,
          riskScore: riskScore.total,
          sessionId: securityDecision.sessionId
        });
      }
      
      console.log('✅ Zero-Trust: Access granted with risk score:', riskScore.total);
      next();
      
    } catch (error) {
      console.error('❌ Zero-Trust middleware error:', error);
      
      // Fail securely - deny access on error
      return res.status(500).json({
        success: false,
        message: 'Security verification failed',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal security error'
      });
    }
  };

  /**
   * Extract comprehensive request context
   */
  extractRequestContext(req) {
    const userAgent = req.headers['user-agent'] || '';
    const ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const forwardedFor = req.headers['x-forwarded-for'];
    let realIp = forwardedFor ? forwardedFor.split(',')[0].trim() : ip;
    
    // Normalize IPv4-mapped IPv6 addresses (::ffff:127.0.0.1 -> 127.0.0.1)
    if (realIp && realIp.startsWith('::ffff:')) {
      const ipv4Part = realIp.substring(7);
      // Validate that it's a proper IPv4 address
      const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (ipv4Regex.test(ipv4Part)) {
        realIp = ipv4Part;
      }
    }
    
    // Ensure we have a valid IP address
    if (!realIp || realIp === '::1') {
      realIp = '127.0.0.1'; // Default to localhost IPv4
    }
    
    // Extract device characteristics
    const deviceInfo = this.parseUserAgent(userAgent);
    const geoLocation = geoip ? geoip.lookup(realIp) : null;
    
    return {
      ip: realIp,
      userAgent,
      deviceInfo,
      geoLocation,
      timestamp: new Date(),
      headers: {
        acceptLanguage: req.headers['accept-language'],
        acceptEncoding: req.headers['accept-encoding'],
        connection: req.headers.connection,
        dnt: req.headers.dnt,
        upgradeInsecureRequests: req.headers['upgrade-insecure-requests']
      },
      requestPath: req.path,
      method: req.method,
      protocol: req.protocol,
      secure: req.secure,
      sessionId: req.sessionID
    };
  }

  /**
   * Parse User-Agent for device fingerprinting
   */
  parseUserAgent(userAgent) {
    const browserRegex = /(Chrome|Firefox|Safari|Edge|Opera)\/([0-9.]+)/i;
    const osRegex = /(Windows|Mac|Linux|Android|iOS)/i;
    const deviceRegex = /(Mobile|Tablet|Desktop)/i;
    
    const browserMatch = userAgent.match(browserRegex);
    const osMatch = userAgent.match(osRegex);
    const deviceMatch = userAgent.match(deviceRegex);
    
    return {
      browser: browserMatch ? `${browserMatch[1]} ${browserMatch[2]}` : 'Unknown',
      os: osMatch ? osMatch[1] : 'Unknown',
      deviceType: deviceMatch ? deviceMatch[1] : 'Desktop',
      isMobile: /Mobile|Android|iPhone|iPad/i.test(userAgent),
      isBot: /bot|crawler|spider|scraper/i.test(userAgent)
    };
  }

  /**
   * Generate or verify device fingerprint
   */
  async verifyDeviceFingerprint(context) {
    try {
      // Create device fingerprint hash
      const fingerprintData = {
        userAgent: context.userAgent,
        acceptLanguage: context.headers.acceptLanguage,
        acceptEncoding: context.headers.acceptEncoding,
        browser: context.deviceInfo.browser,
        os: context.deviceInfo.os,
        deviceType: context.deviceInfo.deviceType
      };
      
      const fingerprintHash = crypto
        .createHash('sha256')
        .update(JSON.stringify(fingerprintData))
        .digest('hex');
      
      // Check if device is known
      let deviceFingerprint = await DeviceFingerprint.findOne({ 
        fingerprintHash 
      });
      
      if (!deviceFingerprint) {
        // New device - create fingerprint record
        deviceFingerprint = new DeviceFingerprint({
          fingerprintHash,
          deviceInfo: context.deviceInfo,
          firstSeen: new Date(),
          lastSeen: new Date(),
          ipAddresses: [context.ip],
          geoLocations: context.geoLocation ? [context.geoLocation] : [],
          trustScore: 0, // New devices start with 0 trust
          isVerified: false,
          riskFactors: ['NEW_DEVICE']
        });
        
        console.log('🆕 Zero-Trust: New device detected');
      } else {
        // Update existing device
        deviceFingerprint.lastSeen = new Date();
        
        // Update IP addresses (keep last 10)
        if (!deviceFingerprint.ipAddresses.includes(context.ip)) {
          deviceFingerprint.ipAddresses.push(context.ip);
          if (deviceFingerprint.ipAddresses.length > 10) {
            deviceFingerprint.ipAddresses = deviceFingerprint.ipAddresses.slice(-10);
          }
        }
        
        // Update geo locations
        if (context.geoLocation) {
          const existingGeo = deviceFingerprint.geoLocations.find(geo => 
            geo.country === context.geoLocation.country && 
            geo.city === context.geoLocation.city
          );
          
          if (!existingGeo) {
            deviceFingerprint.geoLocations.push(context.geoLocation);
            if (deviceFingerprint.geoLocations.length > 5) {
              deviceFingerprint.geoLocations = deviceFingerprint.geoLocations.slice(-5);
            }
          }
        }
        
        console.log('✅ Zero-Trust: Known device verified');
      }
      
      await deviceFingerprint.save();
      return deviceFingerprint;
      
    } catch (error) {
      console.error('❌ Device fingerprint error:', error);
      throw new Error('Device verification failed');
    }
  }

  /**
   * Comprehensive risk assessment
   */
  async assessRisk(context, deviceFingerprint, user) {
    const riskFactors = {
      device: 0,
      location: 0,
      behavior: 0,
      temporal: 0,
      network: 0
    };
    
    // Device risk assessment
    riskFactors.device = await this.assessDeviceRisk(deviceFingerprint, context);
    
    // Location risk assessment
    riskFactors.location = await this.assessLocationRisk(context, user);
    
    // Behavioral risk assessment
    riskFactors.behavior = await this.assessBehavioralRisk(context, user);
    
    // Temporal risk assessment
    riskFactors.temporal = await this.assessTemporalRisk(context, user);
    
    // Network risk assessment
    riskFactors.network = await this.assessNetworkRisk(context);
    
    // Calculate weighted total risk score
    const weights = {
      device: 0.25,
      location: 0.20,
      behavior: 0.25,
      temporal: 0.15,
      network: 0.15
    };
    
    const total = Object.keys(riskFactors).reduce((sum, factor) => {
      return sum + (riskFactors[factor] * weights[factor]);
    }, 0);
    
    return {
      total: Math.round(total),
      factors: riskFactors,
      weights,
      timestamp: new Date()
    };
  }

  /**
   * Device-based risk assessment
   */
  async assessDeviceRisk(deviceFingerprint, context) {
    let risk = 0;
    
    // New device penalty
    if (!deviceFingerprint.isVerified) {
      risk += 40;
    }
    
    // Device trust score (inverse relationship)
    risk += Math.max(0, 30 - deviceFingerprint.trustScore);
    
    // Bot detection
    if (context.deviceInfo.isBot) {
      risk += 60;
    }
    
    // Suspicious user agent
    if (context.userAgent.length < 50 || context.userAgent.includes('curl') || context.userAgent.includes('wget')) {
      risk += 30;
    }
    
    // Mobile device from new location
    if (context.deviceInfo.isMobile && deviceFingerprint.geoLocations.length === 0) {
      risk += 20;
    }
    
    return Math.min(100, risk);
  }

  /**
   * Location-based risk assessment
   */
  async assessLocationRisk(context, user) {
    let risk = 0;
    
    if (!context.geoLocation) {
      return 25; // Unknown location moderate risk
    }
    
    // Check against user's known locations
    if (user && user.knownLocations && user.knownLocations.length > 0) {
      const isKnownLocation = user.knownLocations.some(location => {
        return location.country === context.geoLocation.country &&
               location.city === context.geoLocation.city;
      });
      
      if (!isKnownLocation) {
        risk += 35;
      }
    } else {
      risk += 20; // No known locations
    }
    
    // High-risk countries (example list)
    const highRiskCountries = ['CN', 'RU', 'KP', 'IR'];
    if (highRiskCountries.includes(context.geoLocation.country)) {
      risk += 40;
    }
    
    // VPN/Proxy detection (simplified)
    if (context.geoLocation.range && context.geoLocation.range[1] - context.geoLocation.range[0] > 1000000) {
      risk += 25;
    }
    
    return Math.min(100, risk);
  }

  /**
   * Behavioral risk assessment
   */
  async assessBehavioralRisk(context, user) {
    let risk = 0;
    
    if (!user) return 30;
    
    try {
      // Check recent failed login attempts
      const recentFailures = await SecurityEvent.countDocuments({
        userId: user._id,
        eventType: 'LOGIN_FAILED',
        timestamp: { $gte: new Date(Date.now() - 60 * 60 * 1000) } // Last hour
      });
      
      risk += Math.min(40, recentFailures * 8);
      
      // Check for rapid requests (potential automation)
      const recentRequests = await SecurityEvent.countDocuments({
        userId: user._id,
        eventType: 'API_REQUEST',
        timestamp: { $gte: new Date(Date.now() - 5 * 60 * 1000) } // Last 5 minutes
      });
      
      if (recentRequests > 100) {
        risk += 50;
      } else if (recentRequests > 50) {
        risk += 25;
      }
      
      // Check for unusual access patterns
      const currentHour = new Date().getHours();
      if (user.lastLogin) {
        const lastLoginHour = new Date(user.lastLogin).getHours();
        const hourDifference = Math.abs(currentHour - lastLoginHour);
        
        if (hourDifference > 12) {
          risk += 15; // Unusual time access
        }
      }
      
    } catch (error) {
      console.error('Behavioral risk assessment error:', error);
      risk += 20; // Default risk for assessment failure
    }
    
    return Math.min(100, risk);
  }

  /**
   * Temporal risk assessment
   */
  async assessTemporalRisk(context, user) {
    let risk = 0;
    
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    
    // Off-hours access (assuming business hours 9-17, Mon-Fri)
    if (hour < 6 || hour > 22) {
      risk += 20;
    }
    
    // Weekend access
    if (day === 0 || day === 6) {
      risk += 15;
    }
    
    // Holiday access (simplified - would need holiday calendar)
    // This is a placeholder for holiday detection
    
    // Rapid successive logins
    if (user && user.lastLogin) {
      const timeSinceLastLogin = now.getTime() - new Date(user.lastLogin).getTime();
      if (timeSinceLastLogin < 60000) { // Less than 1 minute
        risk += 30;
      }
    }
    
    return Math.min(100, risk);
  }

  /**
   * Network-based risk assessment
   */
  async assessNetworkRisk(context) {
    let risk = 0;
    
    // Private IP ranges (could indicate VPN/proxy)
    const privateRanges = [
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[01])\./,
      /^192\.168\./
    ];
    
    const isPrivateIP = privateRanges.some(range => range.test(context.ip));
    if (isPrivateIP) {
      risk += 15;
    }
    
    // Check for Tor exit nodes (would need Tor exit node list)
    // This is a placeholder for Tor detection
    
    // Suspicious headers
    if (!context.headers.acceptLanguage) {
      risk += 10;
    }
    
    if (context.headers.dnt === '1') {
      risk += 5; // Do Not Track enabled (privacy-conscious user)
    }
    
    // Missing common headers
    if (!context.headers.acceptEncoding) {
      risk += 15;
    }
    
    return Math.min(100, risk);
  }

  /**
   * Make security decision based on risk assessment
   */
  async makeSecurityDecision(riskScore, context, user) {
    const decision = {
      action: 'ALLOW',
      reason: 'Low risk access',
      requiresAdditionalAuth: false,
      challengeType: null,
      sessionId: null,
      restrictions: []
    };
    
    if (riskScore.total >= this.riskThresholds.CRITICAL) {
      decision.action = 'DENY';
      decision.reason = 'Critical risk level detected';
    } else if (riskScore.total >= this.riskThresholds.HIGH) {
      decision.action = 'CHALLENGE';
      decision.reason = 'High risk requires additional verification';
      decision.requiresAdditionalAuth = true;
      decision.challengeType = 'MFA';
      decision.sessionId = crypto.randomBytes(16).toString('hex');
    } else if (riskScore.total >= this.riskThresholds.MEDIUM) {
      decision.action = 'ALLOW';
      decision.reason = 'Medium risk with restrictions';
      decision.restrictions = ['LIMITED_SCOPE', 'ENHANCED_LOGGING'];
    }
    
    return decision;
  }

  /**
   * Calculate trust level based on risk score
   */
  calculateTrustLevel(riskScore) {
    if (riskScore.total <= this.riskThresholds.LOW) return 'HIGH';
    if (riskScore.total <= this.riskThresholds.MEDIUM) return 'MEDIUM';
    if (riskScore.total <= this.riskThresholds.HIGH) return 'LOW';
    return 'NONE';
  }

  /**
   * Log security event for audit and analysis
   */
  async logSecurityEvent(context, riskScore, securityDecision, user) {
    try {
      const securityEvent = new SecurityEvent({
        userId: user ? user._id : null,
        eventType: 'ZERO_TRUST_VERIFICATION',
        ipAddress: context.ip,
        userAgent: context.userAgent,
        geoLocation: context.geoLocation,
        riskScore: riskScore.total,
        riskFactors: riskScore.factors,
        securityDecision: securityDecision.action,
        deviceFingerprint: context.deviceInfo,
        timestamp: new Date(),
        metadata: {
          requestPath: context.requestPath,
          method: context.method,
          trustLevel: this.calculateTrustLevel(riskScore),
          restrictions: securityDecision.restrictions
        }
      });
      
      await securityEvent.save();
      console.log('📊 Zero-Trust: Security event logged');
      
    } catch (error) {
      console.error('❌ Failed to log security event:', error);
    }
  }

  /**
   * Continuous verification for long-running sessions
   */
  continuousVerification = async (req, res, next) => {
    try {
      if (!req.zeroTrust) {
        return next(); // Skip if not processed by main middleware
      }
      
      const sessionAge = Date.now() - new Date(req.zeroTrust.context.timestamp).getTime();
      
      // Re-verify if session is older than threshold
      if (sessionAge > this.securityPolicies.sessionTimeout) {
        console.log('🔄 Zero-Trust: Session timeout, re-verification required');
        return this.verifyTrust(req, res, next);
      }
      
      // Check for behavioral anomalies
      const behavioralRisk = await this.assessBehavioralRisk(req.zeroTrust.context, req.user);
      
      if (behavioralRisk > 50) {
        console.log('⚠️ Zero-Trust: Behavioral anomaly detected, re-verification required');
        return this.verifyTrust(req, res, next);
      }
      
      next();
      
    } catch (error) {
      console.error('❌ Continuous verification error:', error);
      next();
    }
  };
}

module.exports = new ZeroTrustMiddleware();