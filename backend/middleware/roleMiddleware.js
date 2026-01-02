// Role-based access control middleware

// Check if user has required role
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No user found.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`
      });
    }

    next();
  };
};

// Check if user is admin
const requireAdmin = requireRole('admin');

// Check if user is admin or manager
const requireAdminOrManager = requireRole('admin', 'manager');

// Check if user can access resource (admin, manager, or owner)
const requireOwnershipOrRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No user found.'
      });
    }

    // Check if user has required role
    if (roles.includes(req.user.role)) {
      return next();
    }

    // Check if user is accessing their own resource
    const resourceUserId = req.params.userId || req.params.id;
    if (resourceUserId && resourceUserId === req.user.id) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your own resources or need higher privileges.'
    });
  };
};

// Department-based access control
const requireDepartment = (...departments) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No user found.'
      });
    }

    // Admins can access all departments
    if (req.user.role === 'admin') {
      return next();
    }

    if (!departments.includes(req.user.department)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required department: ${departments.join(' or ')}. Your department: ${req.user.department}`
      });
    }

    next();
  };
};

// Check if user can perform action based on role and resource
const checkPermission = (action, resource) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No user found.'
      });
    }

    const { role, department } = req.user;

    // Define permissions matrix
    const permissions = {
      admin: {
        products: ['create', 'read', 'update', 'delete'],
        categories: ['create', 'read', 'update', 'delete'],
        suppliers: ['create', 'read', 'update', 'delete'],
        orders: ['create', 'read', 'update', 'delete'],
        customers: ['create', 'read', 'update', 'delete'],
        users: ['create', 'read', 'update', 'delete'],
        reports: ['read'],
        settings: ['read', 'update']
      },
      manager: {
        products: ['create', 'read', 'update', 'delete'],
        categories: ['create', 'read', 'update'],
        suppliers: ['create', 'read', 'update'],
        orders: ['create', 'read', 'update'],
        customers: ['create', 'read', 'update', 'delete'],
        users: ['read'],
        reports: ['read'],
        settings: ['read']
      },
      employee: {
        products: ['read', 'update'],
        categories: ['read'],
        suppliers: ['read'],
        orders: ['create', 'read', 'update'],
        customers: ['read', 'update'],
        users: [],
        reports: [],
        settings: []
      }
    };

    // Department-specific permissions
    const departmentPermissions = {
      inventory: {
        products: ['create', 'read', 'update'],
        categories: ['read'],
        suppliers: ['read'],
        orders: ['read']
      },
      sales: {
        products: ['read'],
        categories: ['read'],
        suppliers: ['read'],
        orders: ['create', 'read', 'update']
      },
      purchasing: {
        products: ['read'],
        categories: ['read'],
        suppliers: ['create', 'read', 'update'],
        orders: ['create', 'read', 'update']
      },
      warehouse: {
        products: ['read', 'update'],
        categories: ['read'],
        suppliers: ['read'],
        orders: ['read', 'update']
      }
    };

    // Check role-based permissions
    const rolePermissions = permissions[role]?.[resource] || [];
    if (rolePermissions.includes(action)) {
      return next();
    }

    // Check department-based permissions for employees
    if (role === 'employee') {
      const deptPermissions = departmentPermissions[department]?.[resource] || [];
      if (deptPermissions.includes(action)) {
        return next();
      }
    }

    return res.status(403).json({
      success: false,
      message: `Access denied. You don't have permission to ${action} ${resource}.`
    });
  };
};

// Middleware to check if user account is active
const requireActiveAccount = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No user found.'
    });
  }

  if (!req.user.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Your account has been deactivated. Please contact administrator.'
    });
  }

  next();
};

// Rate limiting based on user role
const getRateLimit = (req) => {
  if (!req.user) return { windowMs: 15 * 60 * 1000, max: 100 }; // 100 requests per 15 minutes for unauthenticated
  
  switch (req.user.role) {
    case 'admin':
      return { windowMs: 15 * 60 * 1000, max: 1000 }; // 1000 requests per 15 minutes
    case 'manager':
      return { windowMs: 15 * 60 * 1000, max: 500 }; // 500 requests per 15 minutes
    case 'employee':
      return { windowMs: 15 * 60 * 1000, max: 200 }; // 200 requests per 15 minutes
    default:
      return { windowMs: 15 * 60 * 1000, max: 100 }; // 100 requests per 15 minutes
  }
};

module.exports = {
  requireRole,
  requireAdmin,
  requireAdminOrManager,
  requireOwnershipOrRole,
  requireDepartment,
  checkPermission,
  requireActiveAccount,
  getRateLimit
};