// Role-based authorization middleware
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).json({
          status: 401,
          message: "Authentication required"
        });
      }

      // Check if user has required role
      const userRole = req.user.role;
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          status: 403,
          message: "Insufficient permissions"
        });
      }

      next();
    } catch (error) {
      console.error("Role middleware error:", error);
      res.status(500).json({
        status: 500,
        message: "Internal server error"
      });
    }
  };
};

// Admin role check
export const requireAdmin = requireRole(['admin']);

// User role check
export const requireUser = requireRole(['user', 'admin']);

export default {
  requireRole,
  requireAdmin,
  requireUser
};


