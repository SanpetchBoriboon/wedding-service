const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

/**
 * GET /api/auth/tokens
 * Get JWT token from environment variables
 */
router.get("/tokens", (req, res) => {
  const token = process.env.TOKEN;

  if (!token) {
    return res.status(500).json({
      error: "Token not found",
      message: "Please run 'npm run generate-token' to create a token first",
    });
  }

  res.json({
    message: "Available auth token",
    token: token,
    user: {
      username: process.env.JWT_USERNAME || "benmeaweddingday",
      id: 1,
      role: "admin",
    },
    usage: {
      header: "Authorization: Bearer <token>",
      example: `Authorization: Bearer ${token}`,
    },
  });
});

/**
 * POST /api/auth/verify
 * ตรวจสอบ token
 */
router.post("/verify", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Token is required",
    });
  }

  console.log(token, process.env.JWT_SECRET);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Invalid or expired token",
      });
    }

    res.json({
      message: "Token is valid",
      user: decoded,
    });
  });
});

module.exports = router;
