const express = require("express");
const router = express.Router();

// Import route modules
const cardsRoutes = require("./cards/cards");
const authRoutes = require("./auth/auth");

// Mount routes
router.use("/auth", authRoutes);
router.use("/cards", cardsRoutes);

module.exports = router;
