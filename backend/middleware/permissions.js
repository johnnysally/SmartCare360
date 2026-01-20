/**
 * SmartCare360 Role-Based Access Control Middleware
 * Defines permissions for 5 user roles across billing system
 */

const ROLES = {
  ADMIN: 'admin',
  BILLING_OFFICER: 'billing_officer',
  ACCOUNTANT: 'accountant',
  FRONT_DESK: 'front_desk',
  DOCTOR: 'doctor',
  PATIENT: 'patient',
};

// Define permissions for each role
const PERMISSIONS = {
  // ADMIN - Full access to all billing operations
  [ROLES.ADMIN]: {
    visits: ['create', 'read', 'update', 'delete'],
    bills: ['create', 'read', 'update', 'delete', 'generate'],
    items: ['create', 'read', 'update', 'delete'],
    payments: ['create', 'read', 'update', 'delete', 'refund'],
    insurance: ['create', 'read', 'update', 'delete'],
    schemes: ['create', 'read', 'update', 'delete', 'link'],
    reports: ['view', 'export', 'manage'],
    audit: ['view', 'export'],
    adjustments: ['create', 'read', 'update', 'delete'],
  },

  // BILLING OFFICER - Can create/manage bills, record payments
  [ROLES.BILLING_OFFICER]: {
    visits: ['create', 'read'],
    bills: ['create', 'read', 'generate'],
    items: ['create', 'read', 'update'],
    payments: ['create', 'read'],
    insurance: ['read'],
    schemes: ['read', 'link'],
    reports: ['view'],
    audit: [],
    adjustments: ['create', 'read'],
  },

  // ACCOUNTANT - View-only + reporting
  [ROLES.ACCOUNTANT]: {
    visits: ['read'],
    bills: ['read'],
    items: ['read'],
    payments: ['read'],
    insurance: ['read'],
    schemes: ['read'],
    reports: ['view', 'export'],
    audit: ['view'],
    adjustments: [],
  },

  // FRONT DESK - Limited to creating visits only
  [ROLES.FRONT_DESK]: {
    visits: ['create', 'read'],
    bills: ['read'],
    items: [],
    payments: [],
    insurance: ['read'],
    schemes: ['read'],
    reports: [],
    audit: [],
    adjustments: [],
  },

  // DOCTOR - View bills and patient prescriptions
  [ROLES.DOCTOR]: {
    visits: ['read'],
    bills: ['read'],
    items: ['read'],
    payments: [],
    insurance: ['read'],
    schemes: ['read'],
    reports: [],
    audit: [],
    adjustments: [],
  },

  // PATIENT - View their own bills
  [ROLES.PATIENT]: {
    visits: [],
    bills: ['read'],
    items: [],
    payments: ['create', 'read'],
    insurance: [],
    schemes: [],
    reports: [],
    audit: [],
    adjustments: [],
  },
};

/**
 * Check if user has permission for an action
 */
function hasPermission(userRole, resource, action) {
  const rolePermissions = PERMISSIONS[userRole];
  if (!rolePermissions) return false;

  const resourcePerms = rolePermissions[resource];
  if (!resourcePerms) return false;

  return resourcePerms.includes(action);
}

/**
 * Middleware to check permissions
 */
function checkPermission(resource, action) {
  return (req, res, next) => {
    const userRole = req.user?.role || req.headers['x-user-role'];

    if (!userRole) {
      return res.status(401).json({ message: 'User role not found' });
    }

    if (!hasPermission(userRole, resource, action)) {
      return res.status(403).json({
        message: `Access denied. User role '${userRole}' does not have '${action}' permission for '${resource}'`,
      });
    }

    next();
  };
}

/**
 * Middleware to check if user can access patient data
 */
function checkPatientAccess(req, res, next) {
  const userRole = req.user?.role || req.headers['x-user-role'];
  const userId = req.user?.id || req.headers['x-user-id'];
  const patientId = req.params.patientId || req.body?.patientId;

  // Admin can access all
  if (userRole === ROLES.ADMIN) {
    return next();
  }

  // Patients can only access their own data
  if (userRole === ROLES.PATIENT) {
    if (userId !== patientId) {
      return res.status(403).json({ message: 'Cannot access other patient data' });
    }
  }

  next();
}

/**
 * Middleware for audit logging
 */
function auditLog(resource, action) {
  return (req, res, next) => {
    // Capture response to log after it's sent
    const originalJson = res.json;
    res.json = function (data) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Log successful operations
        const auditEntry = {
          resource,
          action,
          userRole: req.user?.role || req.headers['x-user-role'],
          userId: req.user?.id || req.headers['x-user-id'],
          timestamp: new Date().toISOString(),
          details: {
            method: req.method,
            path: req.path,
            body: req.body,
          },
        };

        // You can implement actual audit logging here
        console.log('AUDIT LOG:', auditEntry);
      }

      return originalJson.call(this, data);
    };

    next();
  };
}

/**
 * Get all available roles and permissions
 */
function getRolesAndPermissions() {
  return {
    roles: Object.values(ROLES),
    permissions: PERMISSIONS,
  };
}

module.exports = {
  ROLES,
  PERMISSIONS,
  hasPermission,
  checkPermission,
  checkPatientAccess,
  auditLog,
  getRolesAndPermissions,
};
