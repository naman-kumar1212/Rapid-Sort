/**
 * Risk Assessment Utility
 * 
 * Advanced risk scoring algorithms for Zero-Trust security
 * Analyzes multiple risk factors and provides comprehensive risk scoring
 */

const SecurityEvent = require('../models/SecurityEvent');
const DeviceFingerprint = require('../models/DeviceFingerprint');

// Optional geoip-lite dependency
let geoip = null;
try {
  geoip = require('geoip-lite');
} catch (error) {
  // geoip-lite not installed - geographic features will be limited
}

class RiskAssessment {
    constructor() {
        this.riskWeights = {
            device: 0.25,
            location: 0.20,
            behavior: 0.25,
            temporal: 0.15,
            network: 0.15
        };

        this.riskThresholds = {
            LOW: 25,
            MEDIUM: 50,
            HIGH: 75,
            CRITICAL: 90
        };

        this.highRiskCountries = ['CN', 'RU', 'KP', 'IR', 'SY', 'AF'];
        this.suspiciousUserAgents = [
            'curl', 'wget', 'python-requests', 'bot', 'crawler', 'spider', 'scraper'
        ];
    }

    /**
     * Comprehensive risk assessment
     */
    async assessRisk(context, deviceFingerprint, user) {
        try {
            const riskFactors = {
                device: await this.assessDeviceRisk(deviceFingerprint, context),
                location: await this.assessLocationRisk(context, user),
                behavior: await this.assessBehavioralRisk(context, user),
                temporal: await this.assessTemporalRisk(context, user),
                network: await this.assessNetworkRisk(context)
            };

            // Calculate weighted total risk score
            const total = Object.keys(riskFactors).reduce((sum, factor) => {
                return sum + (riskFactors[factor] * this.riskWeights[factor]);
            }, 0);

            const riskLevel = this.getRiskLevel(total);

            return {
                total: Math.round(total),
                level: riskLevel,
                factors: riskFactors,
                weights: this.riskWeights,
                timestamp: new Date(),
                recommendations: this.generateRecommendations(total, riskFactors)
            };

        } catch (error) {
            console.error('❌ Risk assessment error:', error);
            return {
                total: 50, // Default medium risk on error
                level: 'MEDIUM',
                factors: { error: 'Assessment failed' },
                weights: this.riskWeights,
                timestamp: new Date(),
                recommendations: ['Manual review required']
            };
        }
    }

    /**
     * Device-based risk assessment
     */
    async assessDeviceRisk(deviceFingerprint, context) {
        let risk = 0;
        const factors = [];

        // New device penalty
        if (!deviceFingerprint.isVerified) {
            risk += 40;
            factors.push('Unverified device');
        }

        // Device trust score (inverse relationship)
        const trustPenalty = Math.max(0, 30 - deviceFingerprint.trustScore);
        risk += trustPenalty;
        if (trustPenalty > 20) {
            factors.push('Low device trust score');
        }

        // Bot detection
        if (context.deviceInfo.isBot) {
            risk += 60;
            factors.push('Bot detected');
        }

        // Suspicious user agent
        const isSuspiciousUA = this.suspiciousUserAgents.some(ua =>
            context.userAgent.toLowerCase().includes(ua)
        );
        if (isSuspiciousUA || context.userAgent.length < 50) {
            risk += 30;
            factors.push('Suspicious user agent');
        }

        // Mobile device from new location
        if (context.deviceInfo.isMobile && deviceFingerprint.geoLocations.length === 0) {
            risk += 20;
            factors.push('Mobile device from new location');
        }

        // Device age factor
        const deviceAge = Date.now() - deviceFingerprint.firstSeen.getTime();
        const ageInDays = deviceAge / (1000 * 60 * 60 * 24);
        if (ageInDays < 1) {
            risk += 25;
            factors.push('Very new device');
        } else if (ageInDays < 7) {
            risk += 15;
            factors.push('New device');
        }

        // Recent security events
        const recentEvents = deviceFingerprint.securityEvents.filter(event =>
            Date.now() - event.timestamp.getTime() < 24 * 60 * 60 * 1000
        );

        const suspiciousEvents = recentEvents.filter(event =>
            ['ACCESS_DENIED', 'SUSPICIOUS_ACTIVITY'].includes(event.eventType)
        );

        if (suspiciousEvents.length > 0) {
            risk += suspiciousEvents.length * 10;
            factors.push(`${suspiciousEvents.length} recent suspicious events`);
        }

        return {
            score: Math.min(100, risk),
            factors,
            details: {
                trustScore: deviceFingerprint.trustScore,
                isVerified: deviceFingerprint.isVerified,
                deviceAge: Math.round(ageInDays),
                recentEvents: recentEvents.length
            }
        };
    }

    /**
     * Location-based risk assessment
     */
    async assessLocationRisk(context, user) {
        let risk = 0;
        const factors = [];

        if (!context.geoLocation) {
            return {
                score: 25,
                factors: ['Unknown location'],
                details: { location: 'Unknown' }
            };
        }

        // Check against user's known locations
        if (user && user.knownLocations && user.knownLocations.length > 0) {
            const isKnownLocation = user.knownLocations.some(location => {
                return location.country === context.geoLocation.country &&
                    location.city === context.geoLocation.city;
            });

            if (!isKnownLocation) {
                risk += 35;
                factors.push('Unknown location for user');
            }
        } else {
            risk += 20;
            factors.push('No known locations for user');
        }

        // High-risk countries
        if (this.highRiskCountries.includes(context.geoLocation.country)) {
            risk += 40;
            factors.push(`High-risk country: ${context.geoLocation.country}`);
        }

        // VPN/Proxy detection (simplified)
        if (context.geoLocation.range &&
            context.geoLocation.range[1] - context.geoLocation.range[0] > 1000000) {
            risk += 25;
            factors.push('Possible VPN/Proxy');
        }

        // Tor exit node detection (placeholder)
        if (this.isTorExitNode(context.ip)) {
            risk += 50;
            factors.push('Tor exit node detected');
        }

        // Geographic velocity check
        if (user && user.lastLoginLocation) {
            const distance = this.calculateDistance(
                user.lastLoginLocation.latitude,
                user.lastLoginLocation.longitude,
                context.geoLocation.ll[0],
                context.geoLocation.ll[1]
            );

            const timeDiff = Date.now() - new Date(user.lastLogin).getTime();
            const hours = timeDiff / (1000 * 60 * 60);
            const maxPossibleSpeed = distance / hours; // km/h

            if (maxPossibleSpeed > 1000) { // Impossible travel speed
                risk += 45;
                factors.push('Impossible travel speed detected');
            }
        }

        return {
            score: Math.min(100, risk),
            factors,
            details: {
                country: context.geoLocation.country,
                city: context.geoLocation.city,
                isHighRisk: this.highRiskCountries.includes(context.geoLocation.country)
            }
        };
    }

    /**
     * Behavioral risk assessment
     */
    async assessBehavioralRisk(context, user) {
        let risk = 0;
        const factors = [];

        if (!user) {
            return {
                score: 30,
                factors: ['No user context'],
                details: {}
            };
        }

        try {
            // Check recent failed login attempts
            const recentFailures = await SecurityEvent.countDocuments({
                userId: user._id,
                eventType: 'LOGIN_FAILED',
                createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) }
            });

            if (recentFailures > 0) {
                const failureRisk = Math.min(40, recentFailures * 8);
                risk += failureRisk;
                factors.push(`${recentFailures} recent failed logins`);
            }

            // Check for rapid requests (potential automation)
            const recentRequests = await SecurityEvent.countDocuments({
                userId: user._id,
                eventType: 'API_REQUEST',
                createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) }
            });

            if (recentRequests > 100) {
                risk += 50;
                factors.push('Excessive API requests detected');
            } else if (recentRequests > 50) {
                risk += 25;
                factors.push('High API request rate');
            }

            // Check for unusual access patterns
            const currentHour = new Date().getHours();
            if (user.lastLogin) {
                const lastLoginHour = new Date(user.lastLogin).getHours();
                const hourDifference = Math.abs(currentHour - lastLoginHour);

                if (hourDifference > 12) {
                    risk += 15;
                    factors.push('Unusual access time');
                }
            }

            // Check session patterns
            const activeSessions = await this.getActiveSessionCount(user._id);
            if (activeSessions > 5) {
                risk += 20;
                factors.push('Multiple active sessions');
            }

            // Check for privilege escalation attempts
            const escalationAttempts = await SecurityEvent.countDocuments({
                userId: user._id,
                eventType: 'PRIVILEGE_ESCALATION',
                createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
            });

            if (escalationAttempts > 0) {
                risk += 35;
                factors.push('Recent privilege escalation attempts');
            }

        } catch (error) {
            console.error('Behavioral risk assessment error:', error);
            risk += 20;
            factors.push('Assessment error');
        }

        return {
            score: Math.min(100, risk),
            factors,
            details: {
                userId: user._id,
                recentActivity: 'analyzed'
            }
        };
    }

    /**
     * Temporal risk assessment
     */
    async assessTemporalRisk(context, user) {
        let risk = 0;
        const factors = [];

        const now = new Date();
        const hour = now.getHours();
        const day = now.getDay();

        // Off-hours access (assuming business hours 9-17, Mon-Fri)
        if (hour < 6 || hour > 22) {
            risk += 20;
            factors.push('Off-hours access');
        }

        // Weekend access
        if (day === 0 || day === 6) {
            risk += 15;
            factors.push('Weekend access');
        }

        // Holiday access (simplified check)
        if (this.isHoliday(now)) {
            risk += 25;
            factors.push('Holiday access');
        }

        // Rapid successive logins
        if (user && user.lastLogin) {
            const timeSinceLastLogin = now.getTime() - new Date(user.lastLogin).getTime();
            if (timeSinceLastLogin < 60000) { // Less than 1 minute
                risk += 30;
                factors.push('Rapid successive login');
            } else if (timeSinceLastLogin < 300000) { // Less than 5 minutes
                risk += 15;
                factors.push('Quick re-login');
            }
        }

        // Session duration anomalies
        if (context.sessionId && user) {
            const sessionDuration = await this.getSessionDuration(context.sessionId);
            if (sessionDuration > 12 * 60 * 60 * 1000) { // More than 12 hours
                risk += 20;
                factors.push('Unusually long session');
            }
        }

        return {
            score: Math.min(100, risk),
            factors,
            details: {
                hour,
                day,
                isWeekend: day === 0 || day === 6,
                isOffHours: hour < 6 || hour > 22
            }
        };
    }

    /**
     * Network-based risk assessment
     */
    async assessNetworkRisk(context) {
        let risk = 0;
        const factors = [];

        // Private IP ranges (could indicate VPN/proxy)
        const privateRanges = [
            /^10\./,
            /^172\.(1[6-9]|2[0-9]|3[01])\./,
            /^192\.168\./,
            /^127\./
        ];

        const isPrivateIP = privateRanges.some(range => range.test(context.ip));
        if (isPrivateIP) {
            risk += 15;
            factors.push('Private IP address');
        }

        // Check for known malicious IPs
        if (await this.isMaliciousIP(context.ip)) {
            risk += 70;
            factors.push('Known malicious IP');
        }

        // Suspicious headers analysis
        if (!context.headers.acceptLanguage) {
            risk += 10;
            factors.push('Missing Accept-Language header');
        }

        if (!context.headers.acceptEncoding) {
            risk += 15;
            factors.push('Missing Accept-Encoding header');
        }

        // Check for header manipulation
        if (this.hasManipulatedHeaders(context.headers)) {
            risk += 25;
            factors.push('Suspicious header patterns');
        }

        // Rate limiting check
        const requestRate = await this.getRequestRate(context.ip);
        if (requestRate > 100) { // More than 100 requests per minute
            risk += 40;
            factors.push('High request rate');
        } else if (requestRate > 50) {
            risk += 20;
            factors.push('Elevated request rate');
        }

        return {
            score: Math.min(100, risk),
            factors,
            details: {
                ip: context.ip,
                isPrivate: isPrivateIP,
                requestRate
            }
        };
    }

    /**
     * Helper methods
     */
    getRiskLevel(score) {
        if (score >= this.riskThresholds.CRITICAL) return 'CRITICAL';
        if (score >= this.riskThresholds.HIGH) return 'HIGH';
        if (score >= this.riskThresholds.MEDIUM) return 'MEDIUM';
        return 'LOW';
    }

    generateRecommendations(totalRisk, riskFactors) {
        const recommendations = [];

        if (totalRisk >= this.riskThresholds.CRITICAL) {
            recommendations.push('Block access immediately');
            recommendations.push('Require administrator approval');
            recommendations.push('Investigate potential security breach');
        } else if (totalRisk >= this.riskThresholds.HIGH) {
            recommendations.push('Require multi-factor authentication');
            recommendations.push('Limit session duration');
            recommendations.push('Enhanced monitoring');
        } else if (totalRisk >= this.riskThresholds.MEDIUM) {
            recommendations.push('Additional verification recommended');
            recommendations.push('Monitor session activity');
        }

        // Specific recommendations based on risk factors
        Object.keys(riskFactors).forEach(factor => {
            if (riskFactors[factor].score > 50) {
                switch (factor) {
                    case 'device':
                        recommendations.push('Device verification required');
                        break;
                    case 'location':
                        recommendations.push('Geographic verification needed');
                        break;
                    case 'behavior':
                        recommendations.push('Behavioral analysis required');
                        break;
                    case 'network':
                        recommendations.push('Network security review needed');
                        break;
                }
            }
        });

        return [...new Set(recommendations)]; // Remove duplicates
    }

    // Utility methods
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

    isTorExitNode(ip) {
        // Placeholder for Tor exit node detection
        // In production, this would check against a Tor exit node list
        return false;
    }

    async isMaliciousIP(ip) {
        // Placeholder for malicious IP detection
        // In production, this would check against threat intelligence feeds
        return false;
    }

    hasManipulatedHeaders(headers) {
        // Check for common header manipulation patterns
        const suspiciousPatterns = [
            headers.userAgent && headers.userAgent.includes('X-Forwarded-For'),
            headers.connection && headers.connection.toLowerCase() !== 'keep-alive' && headers.connection.toLowerCase() !== 'close',
            !headers.host
        ];

        return suspiciousPatterns.some(pattern => pattern);
    }

    async getRequestRate(ip) {
        // Get request rate for IP in the last minute
        const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
        return await SecurityEvent.countDocuments({
            ipAddress: ip,
            createdAt: { $gte: oneMinuteAgo }
        });
    }

    async getActiveSessionCount(userId) {
        // Placeholder for active session counting
        // In production, this would check session store
        return 1;
    }

    async getSessionDuration(sessionId) {
        // Placeholder for session duration calculation
        // In production, this would check session store
        return 0;
    }

    isHoliday(date) {
        // Simplified holiday check
        // In production, this would use a proper holiday calendar
        const month = date.getMonth();
        const day = date.getDate();

        // Check for major holidays (simplified)
        const holidays = [
            { month: 0, day: 1 },   // New Year's Day
            { month: 6, day: 4 },   // Independence Day
            { month: 11, day: 25 }  // Christmas
        ];

        return holidays.some(holiday =>
            holiday.month === month && holiday.day === day
        );
    }
}

module.exports = new RiskAssessment();