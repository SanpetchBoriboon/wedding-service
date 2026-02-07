const express = require("express");
const {
  authenticateToken,
  optionalAuthenticateToken,
  requireRole,
} = require("../../middleware/auth");
const CardModel = require("../../models/cardModel");
const { bucket } = require("../../config/firebase");
const router = express.Router();

// Wedding card routes

// GET /api/cards - List cards (optional auth to show user's cards)
router.get(
  "/",
  authenticateToken,
  optionalAuthenticateToken,
  async (req, res) => {
    try {
      const cards = await CardModel.findAll({ status: "active" });

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
  },
);

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
      /^https:\/\/storage\.googleapis\.com\/.*\.firebasestorage\.app/, // New format (with optional path)
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

    // Parse Firebase Storage URL to extract filename
    let fileName;
    try {
      const urlObj = new URL(url);

      if (urlObj.hostname === "storage.googleapis.com") {
        // Format: https://storage.googleapis.com/bucket-name/path/file.ext
        const pathParts = urlObj.pathname.split("/");
        if (pathParts.length < 3) {
          throw new Error("Invalid URL format");
        }
        fileName = pathParts.slice(2).join("/"); // Remove empty first element and bucket name
      } else if (urlObj.hostname.includes("firebasestorage.googleapis.com")) {
        // Format: https://firebasestorage.googleapis.com/v0/b/bucket-name/o/path%2Ffile.ext
        const match = urlObj.pathname.match(/^\/v0\/b\/[^\/]+\/o\/(.+)$/);
        if (match) {
          fileName = decodeURIComponent(match[1]);
        } else {
          throw new Error("Invalid Firebase Storage URL format");
        }
      } else {
        throw new Error("Unsupported URL format");
      }
    } catch (error) {
      return res.status(400).json({
        error: "Invalid URL",
        message: "Could not parse Firebase Storage URL",
        details: error.message,
      });
    }

    // Use Firebase SDK to access the file
    const file = bucket.file(fileName);

    // Check if file exists
    const [exists] = await file.exists();
    if (!exists) {
      return res.status(404).json({
        error: "Not Found",
        message: "Image not found in Firebase Storage",
        filename: fileName,
      });
    }

    // Get file metadata for proper headers
    const [metadata] = await file.getMetadata();

    // Set response headers
    res.setHeader(
      "Content-Type",
      metadata.contentType || "application/octet-stream",
    );
    res.setHeader("Content-Length", metadata.size || 0);
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${fileName.split("/").pop()}"`,
    );

    // Stream the file directly from Firebase Storage
    const stream = file.createReadStream();

    stream.on("error", (error) => {
      console.error("Firebase Storage stream error:", error);
      if (!res.headersSent) {
        res.status(500).json({
          error: "Stream Error",
          message: "Failed to stream image from Firebase Storage",
        });
      }
    });

    // Pipe the image data to response
    stream.pipe(res);
  } catch (error) {
    console.error("Error proxying image:", error.message);

    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to proxy image from Firebase Storage",
      });
    }
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
      const existingCard = await CardModel.findById(cardId);

      if (!existingCard) {
        return res.status(404).json({
          error: "Not found",
          message: "Wedding card not found",
        });
      }

      // Delete card
      await CardModel.deleteById(cardId);

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
