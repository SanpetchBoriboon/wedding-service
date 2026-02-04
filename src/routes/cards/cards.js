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

// POST /api/cards - Create card (requires authentication)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, message, template } = req.body;

    // Basic validation
    if (!title || !message) {
      return res.status(400).json({
        error: "Title and message are required",
      });
    }

    // Create new card
    const cardData = {
      title,
      message,
      template: template || "default",
      createdBy: req.user.username,
      userId: req.user.id,
    };

    const card = new Card(cardData);
    const savedCard = await card.save();

    res.status(201).json({
      message: "Wedding card created successfully",
      card: savedCard,
    });
  } catch (error) {
    console.error("Error creating card:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to create card",
    });
  }
});

// GET /api/cards/:id - Get specific card (requires authentication)
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const cardId = req.params.id;
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({
        error: "Not found",
        message: "Wedding card not found",
      });
    }

    res.json({
      message: "Wedding card details",
      card: card,
    });
  } catch (error) {
    console.error("Error fetching card:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch card details",
    });
  }
});

// PUT /api/cards/:id - Update card (requires authentication)
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const cardId = req.params.id;
    const { title, message, template } = req.body;

    // Check if card exists and belongs to user
    const existingCard = await Card.findById(cardId);

    if (!existingCard) {
      return res.status(404).json({
        error: "Not found",
        message: "Wedding card not found",
      });
    }

    // Check ownership (or admin role)
    if (existingCard.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        error: "Forbidden",
        message: "You can only update your own cards",
      });
    }

    // Update card
    const updateData = {};
    if (title) updateData.title = title;
    if (message) updateData.message = message;
    if (template) updateData.template = template;

    const updatedCard = await Card.updateById(cardId, updateData);

    res.json({
      message: "Wedding card updated successfully",
      card: updatedCard,
    });
  } catch (error) {
    console.error("Error updating card:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to update card",
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
