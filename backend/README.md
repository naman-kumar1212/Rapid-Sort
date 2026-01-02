# 🏢 Enterprise Inventory Management System - Backend API

A comprehensive, enterprise-grade REST API with **Zero-Trust Security Architecture** built with Node.js, Express.js, and MongoDB. Features advanced security, business intelligence, and comprehensive reporting capabilities.

## 🚀 Core Features

### 🔒 **Zero-Trust Security Architecture**
- **Continuous Verification**: "Never Trust, Always Verify" for every request
- **Device Fingerprinting**: Cryptographic device identification and trust scoring
- **Risk Assessment**: Multi-factor risk analysis (Device, Location, Behavior, Temporal, Network)
- **Threat Detection**: Real-time malicious pattern recognition and automated response
- **Geographic Intelligence**: IP geolocation, impossible travel detection, high-risk country monitoring
- **Behavioral Analytics**: User pattern learning and anomaly detection

### 📊 **Business Intelligence & Analytics**
- **Advanced Reports**: Sales, Inventory, Customer, and Supplier analytics with export capabilities
- **Real-time Dashboard**: Live KPIs, trends, and performance metrics
- **Interactive Charts**: Revenue trends, product performance, customer insights
- **Predictive Analytics**: Stock optimization, demand forecasting, risk predictions

### 📦 **Inventory Management**
- **Product Management**: Complete CRUD operations with advanced stock tracking
- **Category Management**: Hierarchical product categorization
- **Supplier Management**: Comprehensive supplier relationship and performance tracking
- **Order Management**: Full lifecycle management for purchase and sales orders
- **Stock Tracking**: Real-time inventory levels, movements, and automated alerts

### 👥 **User & Access Management**
- **Authentication**: JWT-based with Zero-Trust continuous verification
- **Authorization**: Role-based and department-based access control
- **User Management**: Complete user lifecycle with security monitoring
- **Session Management**: Secure session handling with risk-based policies

## 🛠️ Tech Stack

### **Core Technologies**
- **Runtime**: Node.js (v16+)
- **Framework**: Express.js with comprehensive middleware stack
- **Database**: MongoDB with Mongoose ODM (with in-memory fallback)
- **Authentication**: JWT (JSON Web Tokens) with Zero-Trust verification

### **Security Technologies**
- **Zero-Trust Middleware**: Custom continuous verification system
- **Device Fingerprinting**: Cryptographic device identification
- **Geographic Intelligence**: geoip-lite for IP geolocation analysis
- **Risk Assessment**: Multi-factor risk scoring algorithms
- **Threat Detection**: Pattern recognition and anomaly detection
- **Encryption**: bcryptjs for password hashing, crypto for fingerprinting

### **Development & Monitoring**
- **Validation**: express-validator with comprehensive rules
- **Rate Limiting**: express-rate-limit with intelligent thresholds
- **Logging**: morgan with security event tracking
- **Development**: nodemon with hot reloading
- **CORS**: Configurable cross-origin resource sharing

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (optional - will use in-memory storage if not available)
- npm or yarn

## 🔧 Installation

### Quick Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env: Set JWT_SECRET=your-secret-key

# 3. Start MongoDB
mongod

# 4. Run the application
npm run dev
```

### Environment Variables

Create `.env` file (copy from `.env.example`):

**Required**:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/inventory_management
JWT_SECRET=your-super-secret-jwt-key-change-this
```

**Optional Databases** (enhance features but not required):
```env
# PostgreSQL - Audit logs
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=inventory_management
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Redis - Caching (set DISABLE_REDIS=true to suppress warnings)
REDIS_HOST=localhost
REDIS_PORT=6379
DISABLE_REDIS=true

# Neo4j - Graph relationships
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password

# InfluxDB - Time-series metrics
INFLUX_URL=http://localhost:8086
INFLUX_TOKEN=your_token
```

### Available Scripts

```bash
npm run dev              # Development with auto-reload
npm start                # Production mode
npm run test-features    # Test all syllabus requirements
npm run demo-encryption  # Demonstrate encryption algorithms
npm run init-db          # Initialize all databases
```

## 🧪 Testing

Test the API endpoints:
```bash
npm run test:api
```

This will run a comprehensive test suite that:
- Checks API health
- Tests user registration/login
- Creates sample data
- Tests all major endpoints
- Verifies authentication and permissions

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### **Authentication & Security Endpoints**

| Endpoint | Description | Zero-Trust |
|----------|-------------|------------|
| `POST /api/auth/register` | User registration with security validation | ✅ |
| `POST /api/auth/login` | User login with device fingerprinting | ✅ |
| `GET /api/auth/me` | Get current user profile | ✅ |
| `PUT /api/auth/profile` | Update user profile | ✅ |
| `POST /api/auth/logout` | Secure logout with session cleanup | ✅ |

### **Core Business Endpoints**

| Endpoint | Description | Security Level |
|----------|-------------|----------------|
| `GET /api/products` | Get all products with filtering | Protected |
| `POST /api/products` | Create new product | Protected |
| `PUT /api/products/:id` | Update product | Protected |
| `DELETE /api/products/:id` | Delete product | Protected |
| `GET /api/categories` | Get all categories | Protected |
| `GET /api/suppliers` | Get all suppliers | Protected |
| `GET /api/orders` | Get all orders | Protected |
| `GET /api/customers` | Get all customers | Protected |

### **Reports & Analytics Endpoints**

| Endpoint | Description | Export Formats |
|----------|-------------|----------------|
| `GET /api/reports/sales` | Sales analytics and top products | JSON, CSV, PDF |
| `GET /api/reports/inventory` | Inventory levels and categories | JSON, CSV, PDF |
| `GET /api/reports/customers` | Customer analytics and insights | JSON, CSV, PDF |
| `GET /api/reports/suppliers` | Supplier performance metrics | JSON, CSV, PDF |
| `GET /api/dashboard/overview` | Real-time dashboard data | JSON |
| `GET /api/dashboard/sales` | Sales trends and analytics | JSON |

### **Zero-Trust Security Endpoints**

| Endpoint | Description | Admin Only |
|----------|-------------|------------|
| `GET /api/zero-trust/dashboard` | Security monitoring dashboard | ✅ |
| `GET /api/zero-trust/events` | Security event logs with filtering | ✅ |
| `GET /api/zero-trust/devices` | Device fingerprint management | ✅ |
| `PUT /api/zero-trust/devices/:id/verify` | Verify trusted device | ✅ |
| `PUT /api/zero-trust/devices/:id/block` | Block suspicious device | ✅ |
| `GET /api/zero-trust/analytics/risk-trends` | Risk analysis trends | ✅ |
| `GET /api/zero-trust/analytics/threat-summary` | Threat detection summary | ✅ |

### **System Health & Monitoring**

| Endpoint | Description | Public |
|----------|-------------|--------|
| `GET /api/health` | Comprehensive system health with security status | ✅ |

For complete API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🔐 User Roles & Permissions

### Roles
- **Admin**: Full system access
- **Manager**: Management-level access
- **Employee**: Department-specific access

### Departments
- **Management**: Full oversight
- **Inventory**: Product and stock management
- **Sales**: Sales orders and customer management
- **Purchasing**: Purchase orders and supplier management
- **Warehouse**: Stock movements and fulfillment

## 📊 Database Models

### **Core Business Models**
- **User**: System users with roles, departments, and security profiles
- **Product**: Inventory items with comprehensive stock tracking and analytics
- **Category**: Hierarchical product categorization with performance metrics
- **Supplier**: Vendor information with performance tracking and risk assessment
- **Customer**: Customer profiles with lifetime value and behavior analysis
- **Order**: Purchase/sales orders with complete lifecycle tracking
- **StockMovement**: Detailed inventory movement tracking with audit trails

### **Zero-Trust Security Models**
- **SecurityEvent**: Comprehensive security event logging with risk analysis
  ```javascript
  {
    eventType: 'LOGIN_SUCCESS' | 'SUSPICIOUS_ACTIVITY' | 'THREAT_DETECTED',
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    riskScore: 0-100,
    ipAddress: String,
    geoLocation: Object,
    deviceFingerprint: Object,
    metadata: Object
  }
  ```

- **DeviceFingerprint**: Device identification and trust management
  ```javascript
  {
    fingerprintHash: String (SHA-256),
    deviceInfo: { browser, os, deviceType },
    trustScore: 0-100,
    isVerified: Boolean,
    geoLocations: Array,
    behaviorProfile: Object,
    securityEvents: Array,
    riskFactors: Array
  }
  ```

### **Analytics & Reporting Models**
- **Report Aggregations**: Pre-computed analytics for performance
- **Dashboard Metrics**: Real-time KPI calculations
- **Trend Analysis**: Historical data patterns and forecasting

## 🔒 Zero-Trust Security Features

### **Continuous Verification Architecture**
- **"Never Trust, Always Verify"**: Every request undergoes security verification
- **Risk-Based Access Control**: Dynamic security policies based on real-time risk assessment
- **Session Integrity**: Continuous monitoring of user sessions and behavior
- **Automated Threat Response**: Real-time blocking and alerting for suspicious activities

### **Device Intelligence & Fingerprinting**
- **Cryptographic Device ID**: SHA-256 hashed device characteristics
- **Trust Score Evolution**: Dynamic scoring based on device behavior (0-100)
- **Device Verification**: Email, SMS, or admin approval workflows
- **Behavioral Profiling**: Learning typical access patterns and detecting anomalies

### **Advanced Risk Assessment (5-Factor Analysis)**
1. **Device Risk (25%)**: Trust score, verification status, device age, bot detection
2. **Location Risk (20%)**: Geographic patterns, high-risk countries, impossible travel
3. **Behavioral Risk (25%)**: Login patterns, API usage, privilege escalation attempts
4. **Temporal Risk (15%)**: Access time patterns, session duration anomalies
5. **Network Risk (15%)**: IP reputation, header analysis, VPN/Proxy detection

### **Threat Detection & Response**
- **Brute Force Protection**: Intelligent failed attempt monitoring with progressive delays
- **Malicious Payload Detection**: Real-time scanning for SQL injection, XSS, command injection
- **Rate Limiting**: Dynamic thresholds with behavioral analysis
- **Geographic Anomalies**: Impossible travel speed detection (>1000 km/h)
- **Statistical Anomaly Detection**: 3-sigma deviation analysis for user behavior

### **Security Monitoring & Audit**
- **Comprehensive Event Logging**: All security events with detailed metadata
- **Real-time Security Dashboard**: Live threat monitoring and risk visualization
- **Audit Trails**: Complete activity tracking for compliance requirements
- **Alert System**: Automated notifications for critical security events

### **Traditional Security Features**
- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **Password Security**: bcrypt hashing with configurable salt rounds
- **Input Validation**: Comprehensive request validation with express-validator
- **Role-Based Access Control**: Granular permission system with department isolation
- **CORS Protection**: Configurable cross-origin resource sharing policies

## 📈 Monitoring & Analytics

### Dashboard Metrics
- Product counts and inventory value
- Low stock alerts
- Recent orders and movements
- Sales analytics and trends

### Reports
- **Inventory Report**: Stock levels, values, categories
- **Sales Report**: Revenue, trends, top products
- **Stock Movement Report**: All inventory changes
- **Supplier Performance**: Delivery rates, order values

## 🚨 Error Handling

The API uses standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## 🔧 Troubleshooting

### Redis Connection Errors
```
⚠️  Redis not available, caching disabled
```
**Solution**: Set `DISABLE_REDIS=true` in `.env` to suppress warnings. Redis is optional.

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB
mongod
```

### Port Already in Use
```bash
# Change port in .env
PORT=5001

# Or kill process (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Login Error Messages
- "Email or password is incorrect. Please try again!" - Wrong credentials
- "Your account has been deactivated" - Contact administrator
- "Please provide valid email and password" - Validation error

## ⚠️ Security Notes

**MD5 Warning**: MD5 is included for educational purposes ONLY. Never use MD5 for passwords or security-critical applications!

**Production Security**:
- ✅ Use bcrypt for passwords (already implemented)
- ✅ Use SHA-256 for data integrity
- ✅ Use HTTPS/TLS in production
- ✅ Change JWT_SECRET to a strong random value
- ❌ Never use MD5 for security

## 🔄 Development Workflow

1. **Start development server**
```bash
npm run dev
```

2. **Test API endpoints**
```bash
npm run test:api
```

3. **Check logs** - The server logs all requests and errors

4. **Database** - Uses MongoDB if available, otherwise in-memory storage

## 📁 Project Structure

```
backend/
├── config/
│   ├── db.js                    # MongoDB connection and configuration
│   └── zeroTrustConfig.js       # Zero-Trust security configuration
├── controllers/
│   ├── authController.js        # Authentication with Zero-Trust integration
│   ├── userController.js        # User management and security profiles
│   ├── productController.js     # Product management with audit trails
│   ├── categoryController.js    # Category management
│   ├── customerController.js    # Customer relationship management
│   ├── dashboardController.js   # Real-time analytics and KPIs
│   └── reportController.js      # Advanced report generation (Sales, Inventory, etc.)
├── middleware/
│   ├── authMiddleware.js        # JWT authentication middleware
│   ├── zeroTrustMiddleware.js   # Zero-Trust continuous verification
│   ├── roleMiddleware.js        # Role-based access control
│   ├── validationMiddleware.js  # Comprehensive input validation
│   ├── rateLimitMiddleware.js   # Intelligent rate limiting
│   ├── dbMiddleware.js          # Database connection middleware
│   └── errorMiddleware.js       # Centralized error handling
├── models/
│   ├── User.js                  # User model with security profiles
│   ├── Product.js               # Product model with analytics
│   ├── Category.js              # Category model
│   ├── Supplier.js              # Supplier model with performance tracking
│   ├── Customer.js              # Customer model with behavior analysis
│   ├── Order.js                 # Order model with lifecycle tracking
│   ├── StockMovement.js         # Stock movement model
│   ├── SecurityEvent.js         # Security event logging model
│   └── DeviceFingerprint.js     # Device fingerprinting model
├── routes/
│   ├── authRoutes.js            # Authentication endpoints
│   ├── userRoutes.js            # User management endpoints
│   ├── productRoutes.js         # Product management endpoints
│   ├── categoryRoutes.js        # Category management endpoints
│   ├── supplierRoutes.js        # Supplier management endpoints
│   ├── customerRoutes.js        # Customer management endpoints
│   ├── orderRoutes.js           # Order management endpoints
│   ├── dashboardRoutes.js       # Dashboard and analytics endpoints
│   ├── reportRoutes.js          # Report generation endpoints
│   ├── settingsRoutes.js        # System settings endpoints
│   └── zeroTrustRoutes.js       # Zero-Trust security management endpoints
├── scripts/
│   ├── initZeroTrust.js         # Zero-Trust system initialization
│   ├── seedReportData.js        # Sample data generator for testing
│   └── install-dependencies.js  # Dependency installation helper
├── utils/
│   ├── riskAssessment.js        # Risk scoring algorithms
│   └── threatDetection.js       # Threat detection and pattern analysis
├── docs/
│   └── ZERO_TRUST_ARCHITECTURE.md # Complete security documentation
├── server.js                    # Main server file with Zero-Trust integration
├── install-dependencies.js      # Dependency checker and installer
└── package.json                # Dependencies and scripts
```

## 🌟 Key Features Implemented

✅ **Complete Authentication System**
- User registration with validation
- JWT-based login/logout
- Password hashing and security
- Role-based access control

✅ **Comprehensive Product Management**
- CRUD operations for products
- Stock level tracking
- Category and supplier associations
- Bulk stock updates

✅ **Advanced Order System**
- Purchase and sales orders
- Order status tracking
- Automatic stock adjustments
- Order validation and business logic

✅ **Real-time Dashboard**
- Key performance indicators
- Inventory analytics
- Sales trends and charts
- Alert system for low stock

✅ **Flexible Reporting**
- Multiple report types
- JSON and CSV export formats
- Date range filtering
- Performance analytics

✅ **Enterprise Security**
- Multi-level permission system
- Rate limiting and abuse prevention
- Input validation and sanitization
- Audit trails for all operations

## 🚀 Production Deployment

### **Zero-Trust Production Setup**

1. **Environment Configuration**
```bash
NODE_ENV=production
MONGODB_URI=mongodb://your-production-cluster
JWT_SECRET=your-ultra-secure-jwt-secret-256-bit
BYPASS_ZERO_TRUST=false
ADMIN_EMAIL=security@yourcompany.com
```

2. **Security Hardening**
```bash
# Configure SMTP for security alerts
SMTP_HOST=smtp.yourcompany.com
SMTP_PORT=587
SMTP_USER=security-alerts@yourcompany.com
SMTP_PASS=your-secure-app-password

# Optional: SIEM Integration
SIEM_ENDPOINT=https://your-siem-platform.com/api
SIEM_API_KEY=your-siem-integration-key
```

3. **Database Optimization**
```bash
# Initialize Zero-Trust system
node scripts/initZeroTrust.js

# Create optimized indexes
npm run setup-production
```

4. **Process Management**
```bash
# Use PM2 for production process management
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### **Security Monitoring & Maintenance**

#### **Real-time Security Dashboard**
Access the Zero-Trust security dashboard at:
```
https://your-domain.com/api/zero-trust/dashboard
```

#### **Security Event Monitoring**
```bash
# Monitor security events in real-time
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  "https://your-api.com/api/zero-trust/events?severity=HIGH"

# Check device fingerprints
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  "https://your-api.com/api/zero-trust/devices?riskThreshold=70"
```

#### **Health Monitoring**
```bash
# Comprehensive health check including security status
curl "https://your-api.com/api/health"

# Response includes:
{
  "success": true,
  "database": { "type": "mongodb", "status": "connected" },
  "security": {
    "zeroTrust": "healthy",
    "initialized": true,
    "components": {
      "database": "healthy",
      "configuration": "healthy",
      "activity": "active"
    }
  }
}
```

### **Performance Optimization**

#### **Caching Strategy**
- **Device Fingerprints**: 1-hour TTL for active devices
- **Risk Assessments**: 5-minute TTL for risk calculations
- **Geographic Data**: 24-hour TTL for IP geolocation
- **Security Events**: Real-time with 1-year retention

#### **Database Indexing**
```javascript
// Automatically created by initZeroTrust.js
db.securityevents.createIndex({ "eventType": 1, "createdAt": -1 })
db.securityevents.createIndex({ "riskScore": -1, "createdAt": -1 })
db.devicefingerprints.createIndex({ "fingerprintHash": 1 }, { unique: true })
db.devicefingerprints.createIndex({ "trustScore": -1 })
```

### **Compliance & Auditing**

#### **Security Standards Compliance**
- ✅ **NIST Cybersecurity Framework** - Complete implementation
- ✅ **ISO 27001** - Information security management
- ✅ **OWASP Top 10** - Web application security
- ✅ **Zero Trust Architecture (NIST SP 800-207)** - Full compliance

#### **Audit Trail Management**
```bash
# Export security events for compliance
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  "https://your-api.com/api/zero-trust/events?format=csv&startDate=2024-01-01"

# Generate compliance reports
node scripts/generateComplianceReport.js --period=monthly
```

### **Incident Response**

#### **Automated Response Actions**
- **Risk Score 75-89**: Require MFA, limit session duration
- **Risk Score 90-100**: Block access, alert administrators
- **Impossible Travel**: Immediate session termination
- **Brute Force Detected**: Progressive IP blocking

#### **Manual Security Actions**
```bash
# Block suspicious device
curl -X PUT -H "Authorization: Bearer $ADMIN_TOKEN" \
  "https://your-api.com/api/zero-trust/devices/DEVICE_ID/block" \
  -d '{"reason": "Suspicious activity detected"}'

# Verify trusted device
curl -X PUT -H "Authorization: Bearer $ADMIN_TOKEN" \
  "https://your-api.com/api/zero-trust/devices/DEVICE_ID/verify" \
  -d '{"verificationMethod": "ADMIN_APPROVAL"}'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the API documentation
2. Run the test suite
3. Check server logs
4. Review error messages

The system is designed to be robust and provide clear error messages to help with debugging and development.