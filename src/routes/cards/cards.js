const express = require("express");
const {
  authenticateToken,
  optionalAuthenticateToken,
  requireRole,
} = require("../../middleware/auth");
const Card = require("../../models/Card");
const axios = require("axios");
const router = express.Router();

// Wedding card routes

// GET /api/cards - List cards (optional auth to show user's cards)
router.get("/", optionalAuthenticateToken, async (req, res) => {
  try {
    let cards;

    if (req.user) {
      // If user is authenticated, show their cards
      cards = await Card.findByUserId(req.user.id);
    } else {
      // If no user, show all public cards
      cards = await Card.findAll({ status: "active" });
    }

    res.json({
      message: "List of Greeting Cards",
      cards: cards,
      count: cards.length,
    });
  } catch (error) {
    console.error("Error fetching cards:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch cards",
    });
  }
});

// GET /api/cards/image-proxy - Proxy images from Firebase Storage to avoid CORS issues
router.get("/image-proxy", async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Image URL is required as query parameter 'url'",
      });
    }

    // Validate that the URL is from Firebase Storage (support both old and new formats)
    const firebaseStoragePatterns = [
      /^https:\/\/firebasestorage\.googleapis\.com/, // Old format
      /^https:\/\/storage\.googleapis\.com\/.*\.firebasestorage\.app/, // New format
    ];

    const isValidFirebaseUrl = firebaseStoragePatterns.some((pattern) =>
      pattern.test(url),
    );

    if (!isValidFirebaseUrl) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Only Firebase Storage URLs are allowed",
        receivedUrl: url,
      });
    }

    // Fetch image from Firebase Storage
    const response = await axios({
      method: "GET",
      url: url,
      responseType: "stream",
      timeout: 10000, // 10 second timeout
    });

    // Set appropriate headers
    res.set({
      "Content-Type": response.headers["content-type"] || "image/jpeg",
      "Content-Length": response.headers["content-length"],
      "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      "Access-Control-Allow-Origin": "*", // Allow all origins
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type",
    });

    // Pipe the image data to the response
    response.data.pipe(res);
  } catch (error) {
    console.error("Error proxying image:", error.message);

    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return res.status(504).json({
        error: "Gateway Timeout",
        message: "Image request timed out",
      });
    }

    if (error.response && error.response.status) {
      return res.status(error.response.status).json({
        error: "Image Fetch Error",
        message: `Failed to fetch image: ${error.response.statusText}`,
      });
    }

    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to proxy image",
    });
  }
});

// DELETE /api/cards/:id - Delete card (requires admin role)
router.delete(
  "/:id",
  authenticateToken,
  requireRole(["admin"]),
  async (req, res) => {
    try {
      const cardId = req.params.id;

      // Check if card exists
      const existingCard = await Card.findById(cardId);

      if (!existingCard) {
        return res.status(404).json({
          error: "Not found",
          message: "Wedding card not found",
        });
      }

      // Delete card
      await Card.deleteById(cardId);

      res.json({
        message: "Wedding card deleted successfully",
        cardId: cardId,
        deletedBy: req.user.username,
      });
    } catch (error) {
      console.error("Error deleting card:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to delete card",
      });
    }
  },
);

module.exports = router;
