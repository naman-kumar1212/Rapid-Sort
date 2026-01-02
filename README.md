# Enterprise Inventory Management System

Full-stack inventory management application built with React TypeScript frontend and Express.js backend, featuring Zero-Trust security architecture and real-time data synchronization.

## Overview

This project implements a comprehensive inventory management system designed for enterprise use. The application provides complete CRUD operations for products, customers, orders, and suppliers, with advanced security features including device fingerprinting, behavioral analytics, and continuous verification. The system supports role-based access control with three user levels (admin, manager, employee) and includes real-time dashboard analytics with WebSocket integration.

## System Architecture

The application follows a three-tier architecture pattern:

- **Presentation Layer**: React TypeScript SPA with Material-UI components
- **Business Logic Layer**: Express.js REST API with middleware-based request processing
- **Data Layer**: MongoDB with Mongoose ODM for schema validation and indexing

**Key Architectural Decisions**:
- Monorepo structure with separate frontend/backend workspaces
- JWT-based stateless authentication with continuous verification
- WebSocket integration for real-time updates
- Context API for client-side state management
- Middleware-based security pipeline with Zero-Trust implementation

## Tech Stack

### Frontend
- **React 18.2.0** - Component-based UI framework
- **TypeScript 4.9.5** - Static type checking
- **Material-UI 5.15.15** - Component library and design system
- **React Router 6.22.3** - Client-side routing
- **Axios 1.6.8** - HTTP client with interceptors
- **Recharts 3.1.2** - Data visualization library

### Backend
- **Node.js >=16.0.0** - JavaScript runtime
- **Express.js 4.19.2** - Web application framework
- **MongoDB** - Primary NoSQL database
- **Mongoose 8.3.2** - ODM with schema validation
- **JWT 9.0.2** - Authentication tokens
- **bcryptjs 2.4.3** - Password hashing
- **WebSocket 8.16.0** - Real-time communication

### Security & Middleware
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Request throttling
- **Input Validation** - express-validator
- **Geographic Intelligence** - geoip-lite

## Folder Structure

```
├── backend/
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   ├── websocket.js             # WebSocket server setup
│   │   └── zeroTrustConfig.js       # Security configuration
│   ├── controllers/                 # Business logic handlers
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification
│   │   ├── zeroTrustMiddleware.js   # Security verification
│   │   └── rateLimitMiddleware.js   # Request throttling
│   ├── models/                      # Mongoose schemas
│   ├── routes/                      # API endpoint definitions
│   ├── scripts/                     # Utility scripts
│   ├── utils/                       # Helper functions
│   └── server.js                    # Application entry point
├── frontend/
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   ├── contexts/                # React Context providers
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── pages/                   # Route components
│   │   ├── services/                # API service layer
│   │   ├── types/                   # TypeScript definitions
│   │   └── utils/                   # Utility functions
│   └── package.json
└── package.json                     # Root workspace configuration
```

## Backend

The Express.js backend implements a RESTful API with the following key features:

**Authentication & Authorization**:
- JWT-based stateless authentication
- Role-based access control (admin, manager, employee)
- Password hashing with bcrypt (12 rounds)
- Session management with continuous verification

**Security Implementation**:
- Zero-Trust architecture with continuous request verification
- Device fingerprinting using cryptographic hashing
- Geographic intelligence with IP geolocation analysis
- Behavioral analytics for anomaly detection
- Rate limiting and DDoS protection

**Database Integration**:
- MongoDB with Mongoose ODM
- Schema validation and indexing
- Connection pooling for performance
- Fallback to in-memory storage when MongoDB unavailable

**Real-time Features**:
- WebSocket server for live data updates
- Event-driven architecture for notifications
- Real-time dashboard synchronization

## Frontend

The React TypeScript frontend provides a modern, responsive user interface:

**Component Architecture**:
- Functional components with React Hooks
- Context API for global state management
- Lazy loading with React.Suspense for performance
- Material-UI component library for consistent design

**State Management**:
- AuthContext for user authentication state
- Custom hooks for API data fetching
- Local state management with useState/useEffect
- WebSocket context for real-time updates

**Performance Optimizations**:
- Code splitting with React.lazy()
- Component memoization with React.memo()
- API response caching (30-second TTL)
- Bundle optimization with tree shaking

**User Interface**:
- Responsive design with Material-UI Grid system
- Dark/light theme support
- Interactive charts and data visualization
- Form validation with real-time feedback

## Database Design

**MongoDB Collections**:

```javascript
// User Schema
{
  firstName: String (required, max: 50),
  lastName: String (required, max: 50),
  email: String (required, unique, validated),
  password: String (hashed, select: false),
  role: Enum ['admin', 'manager', 'employee'],
  department: Enum ['inventory', 'sales', 'purchasing', 'warehouse', 'management'],
  preferences: Object,
  isActive: Boolean,
  timestamps: true
}

// Product Schema
{
  name: String (required, unique, max: 100),
  quantity: Number (min: 0, integer),
  price: Number (required, min: 0),
  category: String (max: 50),
  description: String (max: 500),
  supplier: String (max: 100),
  timestamps: true
}

// Security Event Schema
{
  userId: ObjectId,
  eventType: String,
  riskScore: Number (0-100),
  deviceFingerprint: String,
  ipAddress: String,
  location: Object,
  timestamp: Date
}
```

**Indexing Strategy**:
- Text indexes on product name, category, description for search
- Compound indexes on user role and active status
- Single field indexes on frequently queried fields
- TTL indexes for session and security event cleanup

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration with validation
- `POST /api/auth/login` - User authentication with Zero-Trust verification
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - Secure logout with session cleanup

### Products
- `GET /api/products` - Get products with filtering and pagination
- `GET /api/products/:id` - Get single product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update existing product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/bulk` - Bulk create products
- `DELETE /api/products/bulk` - Bulk delete products

### Dashboard & Analytics
- `GET /api/dashboard/overview` - Real-time dashboard statistics
- `GET /api/dashboard/sales` - Sales analytics and trends
- `GET /api/reports/sales` - Generate sales reports
- `GET /api/reports/inventory` - Generate inventory reports
- `GET /api/reports/customers` - Customer analytics

### Security Monitoring
- `GET /api/zero-trust/dashboard` - Security monitoring dashboard
- `GET /api/zero-trust/events` - Security event logs
- `GET /api/zero-trust/devices` - Device fingerprint management

### System Health
- `GET /api/health` - Comprehensive system health check

## Installation and Setup

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0
- MongoDB (optional - falls back to in-memory storage)

### Installation Steps

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd inventory-management-system
   ```

2. **Install Dependencies**
   ```bash
   npm run install:all
   ```

3. **Configure Backend Environment**
   ```bash
   cd backend
   cp .env.example .env
   ```

4. **Start Application**
   ```bash
   cd ..
   npm start
   ```

This starts both frontend (http://localhost:3000) and backend (http://localhost:5000) concurrently.

## Environment Variables

### Backend (.env)
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/inventory_management

# Authentication
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRE=30d

# Zero-Trust Security
BYPASS_ZERO_TRUST=false
ADMIN_EMAIL=admin@company.com

# SMTP Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# External Integrations (optional)
SIEM_ENDPOINT=https://your-siem.com/api
SIEM_API_KEY=your-siem-api-key
```

### Frontend
Frontend configuration is handled through `package.json` proxy setting pointing to `http://localhost:5000`.

## Running the Application

### Development Mode
```bash
# Start both frontend and backend
npm start

# Start backend only
npm run start:backend

# Start frontend only
npm run start:frontend
```

### Production Mode
```bash
# Build frontend
npm run build

# Start backend in production
cd backend
npm start
```

### Available Scripts
- `npm run install:all` - Install all workspace dependencies
- `npm start` - Start development servers concurrently
- `npm run build` - Build frontend for production
- `npm run setup` - Install dependencies and build


### Backend Testing
```bash
cd backend
npm test
```

**Test Coverage**: Jest framework configured for backend API testing.

### Frontend Testing
```bash
cd frontend
npm test
```

**Test Coverage**: React Testing Library configured for component testing.

**Note**: Comprehensive test suites are not fully implemented. Current testing includes basic API endpoint validation and component rendering tests.

## Known Limitations

1. **Testing Coverage**: Limited unit and integration test coverage
2. **Database Fallback**: In-memory storage loses data on server restart
3. **File Upload**: User avatar upload functionality not fully implemented
4. **Email Service**: SMTP configuration required for security alerts
5. **Mobile Optimization**: Some dashboard components need mobile responsiveness improvements
6. **Error Handling**: Client-side error boundaries not implemented for all components
7. **Performance**: Large dataset pagination could be optimized further
8. **Security**: Rate limiting thresholds may need adjustment for production use

## Future Improvements

1. **Enhanced Testing**: Implement comprehensive unit, integration, and E2E test suites
2. **Mobile Application**: React Native mobile app development
3. **Advanced Analytics**: Machine learning-powered inventory predictions
4. **Multi-tenancy**: Support for multiple organizations
5. **API Gateway**: Centralized API management and documentation
6. **Microservices**: Migration to service-oriented architecture
7. **Performance**: Redis caching layer implementation
8. **Monitoring**: Application performance monitoring integration
9. **CI/CD**: Automated deployment pipeline setup
10. **Documentation**: Interactive API documentation with Swagger/OpenAPI

## Author

**Developer**: Naman Kumar    
**LinkedIn**: https://www.linkedin.com/in/naman-kumar-0980aa293/  
**GitHub**: https://github.com/naman-kumar1212

## License

MIT License - see LICENSE file for details.