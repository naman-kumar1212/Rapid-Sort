/**
 * Zero-Trust Security Configuration
 * 
 * Centralized configuration for Zero-Trust security policies
 * Allows for easy adjustment of security parameters
 */

module.exports = {
  // Risk assessment thresholds
  riskThresholds: {
    LOW: 25,
    MEDIUM: 50,
    HIGH: 75,
    CRITICAL: 90
  },

  // Security policies
  securityPolicies: {
    // Authentication policies
    maxFailedAttempts: 5,
    accountLockoutDuration: 30 * 60 * 1000, // 30 minutes
    passwordResetTokenExpiry: 15 * 60 * 1000, // 15 minutes
    
    // Session policies
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    maxConcurrentSessions: 3,
    sessionRefreshThreshold: 5 * 60 * 1000, // 5 minutes
    
    // Device policies
    deviceTrustDuration: 7 * 24 * 60 * 60 * 1000, // 7 days
    newDeviceVerificationRequired: true,
    deviceFingerprintExpiry: 90 * 24 * 60 * 60 * 1000, // 90 days
    
    // Geographic policies
    geoFenceRadius: 100, // km
    maxTravelSpeed: 1000, // km/h (impossible travel detection)
    highRiskCountries: ['CN', 'RU', 'KP', 'IR', 'SY', 'AF'],
    
    // Rate limiting policies
    apiRateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100,
      skipSuccessfulRequests: false
    },
    
    authRateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5,
      skipSuccessfulRequests: true
    }
  },

  // Risk factor weights (must sum to 1.0)
  riskWeights: {
    device: 0.25,
    location: 0.20,
    behavior: 0.25,
    temporal: 0.15,
    network: 0.15
  },

  // Threat detection patterns
  threatPatterns: {
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
      minDataPoints: 10,
      analysisWindow: 30 * 24 * 60 * 60 * 1000 // 30 days
    }
  },

  // Security actions based on risk levels
  securityActions: {
    LOW: {
      action: 'ALLOW',
      restrictions: [],
      monitoring: 'STANDARD'
    },
    
    MEDIUM: {
      action: 'ALLOW',
      restrictions: ['LIMITED_SCOPE', 'ENHANCED_LOGGING'],
      monitoring: 'ENHANCED'
    },
    
    HIGH: {
      action: 'CHALLENGE',
      restrictions: ['REQUIRE_MFA', 'LIMITED_SESSION'],
      monitoring: 'INTENSIVE'
    },
    
    CRITICAL: {
      action: 'DENY',
      restrictions: ['BLOCK_ACCESS', 'ALERT_ADMIN'],
      monitoring: 'CONTINUOUS'
    }
  },

  // Monitoring and alerting
  monitoring: {
    // Event retention periods
    securityEventRetention: 365 * 24 * 60 * 60 * 1000, // 1 year
    deviceFingerprintRetention: 2 * 365 * 24 * 60 * 60 * 1000, // 2 years
    
    // Alert thresholds
    alertThresholds: {
      highRiskEvents: 5, // per hour
      criticalRiskEvents: 1, // per hour
      failedLogins: 10, // per hour per IP
      newDevices: 20, // per day
      suspiciousLocations: 5 // per day
    },
    
    // Real-time monitoring
    realTimeMonitoring: {
      enabled: true,
      updateInterval: 30 * 1000, // 30 seconds
      dashboardRefresh: 60 * 1000 // 1 minute
    }
  },

  // Integration settings
  integrations: {
    // External threat intelligence
    threatIntelligence: {
      enabled: false, // Set to true when integrated
      providers: ['VirusTotal', 'AbuseIPDB', 'ThreatCrowd'],
      cacheExpiry: 24 * 60 * 60 * 1000 // 24 hours
    },
    
    // SIEM integration
    siem: {
      enabled: false,
      endpoint: process.env.SIEM_ENDPOINT,
      apiKey: process.env.SIEM_API_KEY,
      batchSize: 100
    },
    
    // Email notifications
    notifications: {
      enabled: true,
      adminEmail: process.env.ADMIN_EMAIL || 'admin@company.com',
      smtpConfig: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      }
    }
  },

  // Development and testing
  development: {
    // Bypass Zero-Trust in development (use with caution)
    bypassZeroTrust: process.env.NODE_ENV === 'development' && process.env.BYPASS_ZERO_TRUST === 'true',
    
    // Mock external services in development
    mockExternalServices: process.env.NODE_ENV === 'development',
    
    // Enhanced logging in development
    verboseLogging: process.env.NODE_ENV === 'development',
    
    // Test mode settings
    testMode: {
      enabled: process.env.NODE_ENV === 'test',
      reducedTimeouts: true,
      mockRiskScores: true
    }
  },

  // Performance optimization
  performance: {
    // Caching settings
    cache: {
      deviceFingerprints: {
        ttl: 60 * 60 * 1000, // 1 hour
        maxSize: 10000
      },
      riskAssessments: {
        ttl: 5 * 60 * 1000, // 5 minutes
        maxSize: 5000
      },
      geoLocation: {
        ttl: 24 * 60 * 60 * 1000, // 24 hours
        maxSize: 1000
      }
    },
    
    // Database optimization
    database: {
      indexOptimization: true,
      queryTimeout: 5000, // 5 seconds
      connectionPoolSize: 10
    },
    
    // Async processing
    asyncProcessing: {
      enabled: true,
      queueSize: 1000,
      workerThreads: 4
    }
  }
};