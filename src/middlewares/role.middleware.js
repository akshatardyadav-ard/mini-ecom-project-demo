// This allows only one role, not multiple roles

// const roleMiddleware = (requiredRole) => {
//   return (req, res, next) => {
//     if (req.user.role !== requiredRole) {
//       return res.status(403).json({
//         message: "Access denied. Insufficient permissions",
//       });
//     }
//     next();
//   };
// };

// This allows multiple roles

const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. Insufficient permissions",
        yourRole: req.user.role,
      });
    }
    next();
  };
};

module.exports = roleMiddleware;
