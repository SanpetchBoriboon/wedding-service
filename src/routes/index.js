const express = require("express");
const router = express.Router();

// Import route modules
const cardsRoutes = require("./cards/cards");
const authRoutes = require("./auth/auth");
const uploadRoutes = require("./upload/upload");

// Mount routes
router.use("/auth", authRoutes);
router.use("/cards", cardsRoutes);
router.use("/upload", uploadRoutes);

module.exports = router;
