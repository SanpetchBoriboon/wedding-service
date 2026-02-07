const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

/**
 * POST /api/auth/:role/tokens/
 * Generate JWT token for guest with custom username
 * Only available on 26/02/2026, token expires in 24 hours
 */
router.post("/:role/tokens", (req, res) => {
  const role = req.params.role;

  if (!role) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Role is required",
    });
  }

  // ตรวจสอบวันที่ - อนุญาตเฉพาะวันที่ 26/02/2026
  const currentDate = new Date();
  const allowedDate = new Date(process.env.ALLOWE_DATE);
  // const allowedDate = new Date();

  // เปรียบเทียบเฉพาะวันที่ (ไม่รวมเวลา)
  const currentDateOnly = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
  );
  const allowedDateOnly = new Date(
    allowedDate.getFullYear(),
    allowedDate.getMonth(),
    allowedDate.getDate(),
  );

  if (currentDateOnly.getTime() < allowedDateOnly.getTime()) {
    return res.status(403).json({
      error: "Token Request Forbidden",
      message: "Guest tokens can only be requested on February 26, 2026",
      currentDate: currentDate.toISOString().split("T")[0],
      allowedDate: allowedDate,
    });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      error: "Server Configuration Error",
      message: "JWT secret not configured",
    });
  }

  const userData = {
    username: role + Date.now(),
    id: Date.now(), // Use timestamp as unique ID for guest
    role: role,
    currentDate: currentDate.toISOString().split("T")[0],
    allowedDate: allowedDate,
  };

  let token = "";

  if (role === "guest") {
    token = jwt.sign(userData, process.env.JWT_SECRET, {
      expiresIn: "24h", // Token expires in 24 hours
    });
  } else {
    return res.status(400).json({
      error: "Bad Request",
      message: "Role wrong",
    });
  }

  res.json({
    message: "Guest token generated successfully",
    token: token,
    user: userData,
    tokenExpiresIn: "24 hours",
    validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  });
});

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
