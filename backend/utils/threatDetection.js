/**
 * Threat Detection Utility
 * 
 * Advanced threat detection and pattern analysis for Zero-Trust security
 * Identifies malicious patterns, anomalies, and potential security threats
 */

const SecurityEvent = require('../models/SecurityEvent');
const DeviceFingerprint = require('../models/DeviceFingerprint');

class ThreatDetection {
  constructor() {
    this.threatPatterns = {
      bruteForce: {
        maxAttempts: 5,
        timeWindow: 15 * 60 * 1000, // 15 minutes
        blockDuration: 60 * 60 * 1000 // 1 hour
      },
      rateLimiting: {
        maxRequests: 100,
        timeWindow: 60 * 1000, // 1 minute
        blockDuration: 5 * 60 * 1000 // 5 minutes
      },
      anomalyDetection: {
        deviationThreshold: 3, // Standard deviations
        minDataPoints: 10
      }
    };
    
    this.maliciousPatterns = [
      /sql.*injection/i,
      /union.*select/i,
      /script.*alert/i,
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /onload=/i,
      /onerror=/i,
      /\.\.\/\.\.\//,
      /etc\/passwd/i,
      /cmd\.exe/i,
      /powershell/i
    ];
    
    this.suspiciousUserAgents = [
      'sqlmap',
      'nikto',
      'nmap',
      'masscan',
      'burp',
      'owasp',
      'w3af',
      'acunetix',
      'nessus'
    ];
  }

  /**
   * Comprehensive threat analysis
   */
  async analyzeThreat(context, user, requestData = {}) {
    try {
      const threats = {
        bruteForce: await this.detectBruteForce(context, user),
        rateLimiting: await this.detectRateLimiting(context),
        maliciousPayload: this.detectMaliciousPayload(requestData),
        anomalousBehavior: await this.detectAnomalousBehavior(context, user),
        suspiciousUserAgent: this.detectSuspiciousUserAgent(context),
        geographicAnomaly: await this.detectGeographicAnomaly(context, user),
        temporalAnomaly: this.detectTemporalAnomaly(context, user),
        deviceAnomaly: await this.detectDeviceAnomaly(context, user)
      };
      
      const threatScore = this.calculateThreatScore(threats);
      const threatLevel = this.getThreatLevel(threatScore);
      
      return {
        score: threatScore,
        level: threatLevel,
        threats,
        timestamp: new Date(),
        recommendations: this.generateThreatRecommendations(threats, threatScore)
      };
      
    } catch (error) {
      console.error('❌ Threat analysis error:', error);
      return {
        score: 50,
        level: 'MEDIUM',
        threats: { error: 'Analysis failed' },
        timestamp: new Date(),
        recommendations: ['Manual security review required']
      };
    }
  }

  /**
   * Brute force attack detection
   */
  async detectBruteForce(context, user) {
    try {
      const timeWindow = new Date(Date.now() - this.threatPatterns.bruteForce.timeWindow);
      
      // Check failed login attempts by IP
      const ipFailures = await SecurityEvent.countDocuments({
        ipAddress: context.ip,
        eventType: 'LOGIN_FAILED',
        createdAt: { $gte: timeWindow }
      });
      
      // Check failed login attempts by user
      let userFailures = 0;
      if (user) {
        userFailures = await SecurityEvent.countDocuments({
          userId: user._id,
          eventType: 'LOGIN_FAILED',
          createdAt: { $gte: timeWindow }
        });
      }
      
      const isBruteForce = ipFailures >= this.threatPatterns.bruteForce.maxAttempts ||
                          userFailures >= this.threatPatterns.bruteForce.maxAttempts;
      
      return {
        detected: isBruteForce,
        severity: isBruteForce ? 'HIGH' : 'LOW',
        details: {
          ipFailures,
          userFailures,
          threshold: this.threatPatterns.bruteForce.maxAttempts,
          timeWindow: this.threatPatterns.bruteForce.timeWindow / 60000 // minutes
        },
        action: isBruteForce ? 'BLOCK_IP' : 'NONE'
      };
      
    } catch (error) {
      console.error('Brute force detection error:', error);
      return { detected: false, severity: 'LOW', details: {}, action: 'NONE' };
    }
  }

  /**
   * Rate limiting detection
   */
  async detectRateLimiting(context) {
    try {
      const timeWindow = new Date(Date.now() - this.threatPatterns.rateLimiting.timeWindow);
      
      const requestCount = await SecurityEvent.countDocuments({
        ipAddress: context.ip,
        eventType: 'API_REQUEST',
        createdAt: { $gte: timeWindow }
      });
      
      const isRateLimited = requestCount >= this.threatPatterns.rateLimiting.maxRequests;
      
      return {
        detected: isRateLimited,
        severity: isRateLimited ? 'MEDIUM' : 'LOW',
        details: {
          requestCount,
          threshold: this.threatPatterns.rateLimiting.maxRequests,
          timeWindow: this.threatPatterns.rateLimiting.timeWindow / 1000 // seconds
        },
        action: isRateLimited ? 'RATE_LIMIT' : 'NONE'
      };
      
    } catch (error) {
      console.error('Rate limiting detection error:', error);
      return { detected: false, severity: 'LOW', details: {}, action: 'NONE' };
    }
  }

  /**
   * Malicious payload detection
   */
  detectMaliciousPayload(requestData) {
    const payloadString = JSON.stringify(requestData).toLowerCase();
    const detectedPatterns = [];
    
    this.maliciousPatterns.forEach((pattern, index) => {
      if (pattern.test(payloadString)) {
        detectedPatterns.push({
          pattern: pattern.source,
          type: this.getPatternType(index)
        });
      }
    });
    
    const isMalicious = detectedPatterns.length > 0;
    
    return {
      detected: isMalicious,
      severity: isMalicious ? 'HIGH' : 'LOW',
      details: {
        patterns: detectedPatterns,
        payloadSize: payloadString.length
      },
      action: isMalicious ? 'BLOCK_REQUEST' : 'NONE'
    };
  }

  /**
   * Anomalous behavior detection
   */
  async detectAnomalousBehavior(context, user) {
    if (!user) {
      return { detected: false, severity: 'LOW', details: {}, action: 'NONE' };
    }
    
    try {
      // Get user's historical behavior
      const historicalEvents = await SecurityEvent.find({
        userId: user._id,
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
      }).sort({ createdAt: -1 }).limit(1000);
      
      if (historicalEvents.length < this.threatPatterns.anomalyDetection.minDataPoints) {
        return { detected: false, severity: 'LOW', details: { reason: 'Insufficient data' }, action: 'NONE' };
      }
      
      const anomalies = [];
      
      // Analyze access patterns
      const accessHours = historicalEvents.map(event => new Date(event.createdAt).getHours());
      const currentHour = new Date().getHours();
      
      if (this.isStatisticalAnomaly(accessHours, currentHour)) {
        anomalies.push('Unusual access time');
      }
      
      // Analyze request frequency
      const requestCounts = this.getRequestCountsByDay(historicalEvents);
      const todayRequests = await SecurityEvent.countDocuments({
        userId: user._id,
        createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
      });
      
      if (this.isStatisticalAnomaly(requestCounts, todayRequests)) {
        anomalies.push('Unusual request frequency');
      }
      
      const isAnomalous = anomalies.length > 0;
      
      return {
        detected: isAnomalous,
        severity: isAnomalous ? 'MEDIUM' : 'LOW',
        details: {
          anomalies,
          historicalDataPoints: historicalEvents.length,
          currentHour,
          todayRequests
        },
        action: isAnomalous ? 'ENHANCED_MONITORING' : 'NONE'
      };
      
    } catch (error) {
      console.error('Anomalous behavior detection error:', error);
      return { detected: false, severity: 'LOW', details: {}, action: 'NONE' };
    }
  }

  /**
   * Suspicious user agent detection
   */
  detectSuspiciousUserAgent(context) {
    const userAgent = context.userAgent.toLowerCase();
    const suspiciousTools = this.suspiciousUserAgents.filter(tool => 
      userAgent.includes(tool)
    );
    
    const isSuspicious = suspiciousTools.length > 0 || 
                        userAgent.length < 20 || 
                        !userAgent.includes('mozilla');
    
    return {
      detected: isSuspicious,
      severity: isSuspicious ? 'MEDIUM' : 'LOW',
      details: {
        userAgent: context.userAgent,
        suspiciousTools,
        length: context.userAgent.length
      },
      action: isSuspicious ? 'ENHANCED_LOGGING' : 'NONE'
    };
  }

  /**
   * Geographic anomaly detection
   */
  async detectGeographicAnomaly(context, user) {
    if (!context.geoLocation || !user) {
      return { detected: false, severity: 'LOW', details: {}, action: 'NONE' };
    }
    
    try {
      // Get user's recent locations
      const recentEvents = await SecurityEvent.find({
        userId: user._id,
        'geoLocation.country': { $exists: true },
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
      }).sort({ createdAt: -1 }).limit(10);
      
      if (recentEvents.length === 0) {
        return { detected: false, severity: 'LOW', details: { reason: 'No recent location data' }, action: 'NONE' };
      }
      
      const recentCountries = [...new Set(recentEvents.map(event => event.geoLocation.country))];
      const currentCountry = context.geoLocation.country;
      
      const isNewCountry = !recentCountries.includes(currentCountry);
      
      // Calculate impossible travel
      const lastEvent = recentEvents[0];
      let impossibleTravel = false;
      
      if (lastEvent && lastEvent.geoLocation.latitude && lastEvent.geoLocation.longitude) {
        const distance = this.calculateDistance(
          lastEvent.geoLocation.latitude,
          lastEvent.geoLocation.longitude,
          context.geoLocation.ll[0],
          context.geoLocation.ll[1]
        );
        
        const timeDiff = Date.now() - new Date(lastEvent.createdAt).getTime();
        const hours = timeDiff / (1000 * 60 * 60);
        const maxSpeed = distance / hours; // km/h
        
        impossibleTravel = maxSpeed > 1000; // Impossible by commercial aircraft
      }
      
      const isAnomalous = isNewCountry || impossibleTravel;
      
      return {
        detected: isAnomalous,
        severity: impossibleTravel ? 'HIGH' : (isNewCountry ? 'MEDIUM' : 'LOW'),
        details: {
          currentCountry,
          recentCountries,
          isNewCountry,
          impossibleTravel
        },
        action: impossibleTravel ? 'BLOCK_ACCESS' : (isNewCountry ? 'REQUIRE_VERIFICATION' : 'NONE')
      };
      
    } catch (error) {
      console.error('Geographic anomaly detection error:', error);
      return { detected: false, severity: 'LOW', details: {}, action: 'NONE' };
    }
  }

  /**
   * Temporal anomaly detection
   */
  detectTemporalAnomaly(context, user) {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    
    const anomalies = [];
    
    // Check for unusual hours (very late night/early morning)
    if (hour >= 2 && hour <= 5) {
      anomalies.push('Very late night access');
    }
    
    // Check for weekend access (if user typically works weekdays)
    if (day === 0 || day === 6) {
      anomalies.push('Weekend access');
    }
    
    // Check for rapid successive logins
    if (user && user.lastLogin) {
      const timeSinceLastLogin = now.getTime() - new Date(user.lastLogin).getTime();
      if (timeSinceLastLogin < 30000) { // Less than 30 seconds
        anomalies.push('Rapid successive login');
      }
    }
    
    const isAnomalous = anomalies.length > 0;
    
    return {
      detected: isAnomalous,
      severity: isAnomalous ? 'LOW' : 'LOW',
      details: {
        hour,
        day,
        anomalies
      },
      action: isAnomalous ? 'LOG_ANOMALY' : 'NONE'
    };
  }

  /**
   * Device anomaly detection
   */
  async detectDeviceAnomaly(context, user) {
    if (!user) {
      return { detected: false, severity: 'LOW', details: {}, action: 'NONE' };
    }
    
    try {
      // Get user's known devices
      const knownDevices = await DeviceFingerprint.find({
        'associatedUsers.userId': user._id
      });
      
      const currentFingerprint = this.generateDeviceFingerprint(context);
      const isKnownDevice = knownDevices.some(device => 
        device.fingerprintHash === currentFingerprint
      );
      
      const anomalies = [];
      
      if (!isKnownDevice) {
        anomalies.push('Unknown device');
      }
      
      // Check for suspicious device characteristics
      if (context.deviceInfo.isBot) {
        anomalies.push('Bot detected');
      }
      
      if (context.userAgent.length < 50) {
        anomalies.push('Suspicious user agent');
      }
      
      const isAnomalous = anomalies.length > 0;
      
      return {
        detected: isAnomalous,
        severity: isAnomalous ? 'MEDIUM' : 'LOW',
        details: {
          isKnownDevice,
          knownDeviceCount: knownDevices.length,
          anomalies
        },
        action: !isKnownDevice ? 'DEVICE_VERIFICATION' : 'NONE'
      };
      
    } catch (error) {
      console.error('Device anomaly detection error:', error);
      return { detected: false, severity: 'LOW', details: {}, action: 'NONE' };
    }
  }

  /**
   * Calculate overall threat score
   */
  calculateThreatScore(threats) {
    const weights = {
      bruteForce: 25,
      rateLimiting: 15,
      maliciousPayload: 30,
      anomalousBehavior: 10,
      suspiciousUserAgent: 5,
      geographicAnomaly: 10,
      temporalAnomaly: 3,
      deviceAnomaly: 2
    };
    
    let totalScore = 0;
    
    Object.keys(threats).forEach(threatType => {
      const threat = threats[threatType];
      if (threat && threat.detected) {
        const severityMultiplier = this.getSeverityMultiplier(threat.severity);
        totalScore += weights[threatType] * severityMultiplier;
      }
    });
    
    return Math.min(100, totalScore);
  }

  /**
   * Get threat level based on score
   */
  getThreatLevel(score) {
    if (score >= 80) return 'CRITICAL';
    if (score >= 60) return 'HIGH';
    if (score >= 30) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Generate threat-based recommendations
   */
  generateThreatRecommendations(threats, threatScore) {
    const recommendations = [];
    
    Object.keys(threats).forEach(threatType => {
      const threat = threats[threatType];
      if (threat && threat.detected) {
        switch (threat.action) {
          case 'BLOCK_IP':
            recommendations.push('Block IP address immediately');
            break;
          case 'BLOCK_ACCESS':
            recommendations.push('Block user access');
            break;
          case 'RATE_LIMIT':
            recommendations.push('Apply rate limiting');
            break;
          case 'REQUIRE_VERIFICATION':
            recommendations.push('Require additional verification');
            break;
          case 'ENHANCED_MONITORING':
            recommendations.push('Enable enhanced monitoring');
            break;
          case 'DEVICE_VERIFICATION':
            recommendations.push('Verify device identity');
            break;
        }
      }
    });
    
    if (threatScore >= 80) {
      recommendations.push('Immediate security team notification');
      recommendations.push('Consider incident response procedures');
    }
    
    return [...new Set(recommendations)];
  }

  /**
   * Helper methods
   */
  getPatternType(index) {
    const types = [
      'SQL Injection', 'SQL Injection', 'XSS', 'XSS', 'XSS', 'XSS',
      'XSS', 'XSS', 'Path Traversal', 'File Access', 'Command Injection', 'Command Injection'
    ];
    return types[index] || 'Unknown';
  }

  getSeverityMultiplier(severity) {
    switch (severity) {
      case 'CRITICAL': return 1.0;
      case 'HIGH': return 0.8;
      case 'MEDIUM': return 0.6;
      case 'LOW': return 0.3;
      default: return 0.1;
    }
  }

  isStatisticalAnomaly(historicalData, currentValue) {
    if (historicalData.length < this.threatPatterns.anomalyDetection.minDataPoints) {
      return false;
    }
    
    const mean = historicalData.reduce((sum, val) => sum + val, 0) / historicalData.length;
    const variance = historicalData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / historicalData.length;
    const stdDev = Math.sqrt(variance);
    
    const zScore = Math.abs((currentValue - mean) / stdDev);
    return zScore > this.threatPatterns.anomalyDetection.deviationThreshold;
  }

  getRequestCountsByDay(events) {
    const dailyCounts = {};
    
    events.forEach(event => {
      const date = new Date(event.createdAt).toDateString();
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });
    
    return Object.values(dailyCounts);
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toRad(deg) {
    return deg * (Math.PI / 180);
  }

  generateDeviceFingerprint(context) {
    const crypto = require('crypto');
    const fingerprintData = {
      userAgent: context.userAgent,
      acceptLanguage: context.headers.acceptLanguage,
      acceptEncoding: context.headers.acceptEncoding,
      browser: context.deviceInfo.browser,
      os: context.deviceInfo.os,
      deviceType: context.deviceInfo.deviceType
    };
    
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(fingerprintData))
      .digest('hex');
  }
}

module.exports = new ThreatDetection();