/**
 * Zero-Trust Security Routes
 * 
 * API endpoints for Zero-Trust security monitoring and management
 * Provides real-time security insights and administrative controls
 */

const express = require('express');
const SecurityEvent = require('../models/SecurityEvent');
const DeviceFingerprint = require('../models/DeviceFingerprint');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

const router = express.Router();

// All routes require authentication
router.use(protect);

/**
 * GET /api/zero-trust/dashboard
 * Security dashboard overview
 */
router.get('/dashboard', requireRole(['admin', 'security']), async (req, res) => {
  try {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Security metrics for last 24 hours
    const metrics = {
      totalEvents: await SecurityEvent.countDocuments({
        createdAt: { $gte: last24Hours }
      }),
      
      highRiskEvents: await SecurityEvent.countDocuments({
        riskScore: { $gte: 70 },
        createdAt: { $gte: last24Hours }
      }),
      
      failedLogins: await SecurityEvent.countDocuments({
        eventType: 'LOGIN_FAILED',
        createdAt: { $gte: last24Hours }
      }),
      
      suspiciousActivity: await SecurityEvent.countDocuments({
        eventType: { $in: ['SUSPICIOUS_ACTIVITY', 'BRUTE_FORCE_ATTEMPT', 'ANOMALOUS_BEHAVIOR'] },
        createdAt: { $gte: last24Hours }
      }),
      
      newDevices: await DeviceFingerprint.countDocuments({
        firstSeen: { $gte: last24Hours }
      }),
      
      unverifiedDevices: await DeviceFingerprint.countDocuments({
        isVerified: false
      }),
      
      blockedDevices: await DeviceFingerprint.countDocuments({
        isBlocked: true
      })
    };

    // Risk distribution
    const riskDistribution = await SecurityEvent.aggregate([
      { $match: { createdAt: { $gte: last24Hours } } },
      {
        $bucket: {
          groupBy: '$riskScore',
          boundaries: [0, 25, 50, 75, 90, 100],
          default: 'Unknown',
          output: {
            count: { $sum: 1 },
            avgScore: { $avg: '$riskScore' }
          }
        }
      }
    ]);

    // Geographic distribution
    const geoDistribution = await SecurityEvent.aggregate([
      { $match: { createdAt: { $gte: last7Days } } },
      {
        $group: {
          _id: '$geoLocation.country',
          count: { $sum: 1 },
          avgRiskScore: { $avg: '$riskScore' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Recent high-risk events
    const recentHighRiskEvents = await SecurityEvent.find({
      riskScore: { $gte: 70 },
      createdAt: { $gte: last24Hours }
    })
    .sort({ createdAt: -1 })
    .limit(10)
    .select('eventType riskScore ipAddress geoLocation.country createdAt userId');

    res.json({
      success: true,
      data: {
        metrics,
        riskDistribution,
        geoDistribution,
        recentHighRiskEvents,
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error('Zero-Trust dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load security dashboard',
      error: error.message
    });
  }
});

/**
 * GET /api/zero-trust/events
 * Security events with filtering and pagination
 */
router.get('/events', requireRole(['admin', 'security']), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      eventType,
      severity,
      riskScore,
      startDate,
      endDate,
      ipAddress,
      userId
    } = req.query;

    // Build filter query
    const filter = {};
    
    if (eventType) filter.eventType = eventType;
    if (severity) filter.severity = severity;
    if (riskScore) filter.riskScore = { $gte: parseInt(riskScore) };
    if (ipAddress) filter.ipAddress = ipAddress;
    if (userId) filter.userId = userId;
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    
    const events = await SecurityEvent.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'email role');

    const total = await SecurityEvent.countDocuments(filter);

    res.json({
      success: true,
      data: {
        events,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Security events query error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve security events',
      error: error.message
    });
  }
});

/**
 * GET /api/zero-trust/devices
 * Device fingerprints with risk analysis
 */
router.get('/devices', requireRole(['admin', 'security']), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      riskThreshold,
      verified,
      blocked,
      sortBy = 'lastSeen'
    } = req.query;

    const filter = {};
    
    if (riskThreshold) filter.riskScore = { $gte: parseInt(riskThreshold) };
    if (verified !== undefined) filter.isVerified = verified === 'true';
    if (blocked !== undefined) filter.isBlocked = blocked === 'true';

    const skip = (page - 1) * limit;
    const sortOrder = sortBy === 'riskScore' ? -1 : -1; // Descending order

    const devices = await DeviceFingerprint.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('associatedUsers.userId', 'email role');

    const total = await DeviceFingerprint.countDocuments(filter);

    res.json({
      success: true,
      data: {
        devices,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Device fingerprints query error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve device fingerprints',
      error: error.message
    });
  }
});

/**
 * PUT /api/zero-trust/devices/:id/verify
 * Verify a device fingerprint
 */
router.put('/devices/:id/verify', requireRole(['admin', 'security']), async (req, res) => {
  try {
    const { verificationMethod = 'ADMIN_APPROVAL' } = req.body;
    
    const device = await DeviceFingerprint.findById(req.params.id);
    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device fingerprint not found'
      });
    }

    device.isVerified = true;
    device.verificationMethod = verificationMethod;
    device.verifiedAt = new Date();
    device.updateTrustScore();

    await device.save();

    res.json({
      success: true,
      message: 'Device verified successfully',
      data: device
    });

  } catch (error) {
    console.error('Device verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify device',
      error: error.message
    });
  }
});

/**
 * PUT /api/zero-trust/devices/:id/block
 * Block a device fingerprint
 */
router.put('/devices/:id/block', requireRole(['admin', 'security']), async (req, res) => {
  try {
    const { reason = 'Security concern' } = req.body;
    
    const device = await DeviceFingerprint.findById(req.params.id);
    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device fingerprint not found'
      });
    }

    device.isBlocked = true;
    device.blockedReason = reason;
    device.blockedAt = new Date();
    device.blockedBy = req.user._id;

    await device.save();

    res.json({
      success: true,
      message: 'Device blocked successfully',
      data: device
    });

  } catch (error) {
    console.error('Device blocking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to block device',
      error: error.message
    });
  }
});

/**
 * GET /api/zero-trust/analytics/risk-trends
 * Risk score trends over time
 */
router.get('/analytics/risk-trends', requireRole(['admin', 'security']), async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const trends = await SecurityEvent.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          },
          avgRiskScore: { $avg: '$riskScore' },
          maxRiskScore: { $max: '$riskScore' },
          eventCount: { $sum: 1 },
          highRiskCount: {
            $sum: { $cond: [{ $gte: ['$riskScore', 70] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    res.json({
      success: true,
      data: trends
    });

  } catch (error) {
    console.error('Risk trends analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze risk trends',
      error: error.message
    });
  }
});

/**
 * GET /api/zero-trust/analytics/threat-summary
 * Threat detection summary
 */
router.get('/analytics/threat-summary', requireRole(['admin', 'security']), async (req, res) => {
  try {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const threatSummary = await SecurityEvent.aggregate([
      { $match: { createdAt: { $gte: last24Hours } } },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 },
          avgRiskScore: { $avg: '$riskScore' },
          maxRiskScore: { $max: '$riskScore' },
          uniqueIPs: { $addToSet: '$ipAddress' },
          uniqueUsers: { $addToSet: '$userId' }
        }
      },
      {
        $project: {
          eventType: '$_id',
          count: 1,
          avgRiskScore: { $round: ['$avgRiskScore', 2] },
          maxRiskScore: 1,
          uniqueIPCount: { $size: '$uniqueIPs' },
          uniqueUserCount: { $size: '$uniqueUsers' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: threatSummary
    });

  } catch (error) {
    console.error('Threat summary analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate threat summary',
      error: error.message
    });
  }
});

/**
 * GET /api/zero-trust/user/:userId/security-profile
 * User security profile and risk history
 */
router.get('/user/:userId/security-profile', requireRole(['admin', 'security']), async (req, res) => {
  try {
    const { userId } = req.params;
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // User's security events
    const securityEvents = await SecurityEvent.find({
      userId,
      createdAt: { $gte: last30Days }
    })
    .sort({ createdAt: -1 })
    .limit(100);

    // User's devices
    const devices = await DeviceFingerprint.find({
      'associatedUsers.userId': userId
    });

    // Risk score trends
    const riskTrends = await SecurityEvent.aggregate([
      { 
        $match: { 
          userId: require('mongoose').Types.ObjectId(userId),
          createdAt: { $gte: last30Days }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          },
          avgRiskScore: { $avg: '$riskScore' },
          maxRiskScore: { $max: '$riskScore' },
          eventCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    // Security summary
    const summary = {
      totalEvents: securityEvents.length,
      avgRiskScore: securityEvents.reduce((sum, event) => sum + event.riskScore, 0) / securityEvents.length || 0,
      maxRiskScore: Math.max(...securityEvents.map(event => event.riskScore), 0),
      deviceCount: devices.length,
      verifiedDevices: devices.filter(device => device.isVerified).length,
      blockedDevices: devices.filter(device => device.isBlocked).length
    };

    res.json({
      success: true,
      data: {
        summary,
        recentEvents: securityEvents.slice(0, 20),
        devices,
        riskTrends
      }
    });

  } catch (error) {
    console.error('User security profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user security profile',
      error: error.message
    });
  }
});

module.exports = router;