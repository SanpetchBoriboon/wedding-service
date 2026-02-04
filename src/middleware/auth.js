const jwt = require("jsonwebtoken");

/**
 * Bearer Token Authentication Middleware
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (token == null) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Access token is required",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Invalid or expired token",
      });
    }

    req.user = user;
    next();
  });
};

/**
 * Optional Bearer Token Authentication Middleware
 * ไม่บังคับต้องมี token แต่ถ้ามีจะทำการ verify
 */
const optionalAuthenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      req.user = null;
    } else {
      req.user = user;
    }
    next();
  });
};

/**
 * Generate JWT Token
 */
const generateToken = (payload, expiresIn = "24h") => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiresIn,
  });
};

/**
 * Role-based access control middleware
 */
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Access token is required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Insufficient permissions",
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  optionalAuthenticateToken,
  generateToken,
  requireRole,
};
