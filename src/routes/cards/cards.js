const express = require("express");
const {
  authenticateToken,
  optionalAuthenticateToken,
  requireRole,
} = require("../../middleware/auth");
const Card = require("../../models/Card");
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
