const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { authenticateToken } = require("../../middleware/auth");
const { bucket, isInitialized } = require("../../config/firebase");
const Card = require("../../models/cardModel");

const router = express.Router();

// Configure multer for memory storage (since we're uploading to Firebase)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if the file is an image
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Optional file upload middleware for card-image endpoint
const optionalImageUpload = (req, res, next) => {
  const uploadSingle = upload.single("image");

  uploadSingle(req, res, (err) => {
    // If error is about missing file, that's okay for optional upload
    if (err && err.code === "LIMIT_UNEXPECTED_FILE") {
      // Continue without file
      return next();
    } else if (err) {
      // Other multer errors (file too large, wrong type, etc.)
      return res.status(400).json({
        error: "Upload error",
        message: err.message,
      });
    }
    // Continue normally (with or without file)
    next();
  });
};

// POST /api/upload/card-image - Upload image and create/update card (image optional)
router.post(
  "/card-image",
  authenticateToken,
  optionalImageUpload,
  async (req, res) => {
    try {
      if (!isInitialized && req.file) {
        return res.status(503).json({
          error: "Service unavailable",
          message: "Firebase storage is not configured",
        });
      }

      const { title, message } = req.body;

      // Validation: require at least title or message if no cardId (for new card)
      if (!title && !message) {
        return res.status(400).json({
          error: "Validation error",
          message: "Title or message is required for new card",
        });
      }

      // Function to create or update card
      const processCard = async (imageUrl = null) => {
        let card;

        const templateList = [
          "#7E8B78",
          "#BFC6B4",
          "#E1E6D5",
          "#F8F3C7",
          "#E9C56E",
        ];

        // Randomly select a template from the list
        const randomTemplate =
          templateList[Math.floor(Math.random() * templateList.length)];

        // Create new card
        const cardData = {
          title: title || "Wedding Card",
          message: message || "Beautiful wedding card",
          template: randomTemplate,
          imageUrl: imageUrl,
          createdBy: req.user.username,
          userId: req.user.id,
        };

        const newCard = new Card(cardData);
        card = await newCard.save();

        return card;
      };

      // If no image file, just create/update card
      if (!req.file) {
        const card = await processCard();

        return res.status(200).json({
          message: "Card created successfully",
          data: {
            card: card,
          },
        });
      } else {
        // If image file exists, upload to Firebase first
        const fileExtension = path.extname(req.file.originalname);
        const fileName = `photo-all-wishes/${uuidv4()}${fileExtension}`;

        // Create a file in Firebase Storage
        const file = bucket.file(fileName);

        // Create a write stream
        const stream = file.createWriteStream({
          metadata: {
            contentType: req.file.mimetype,
            metadata: {
              uploadedBy: req.user.username,
              originalName: req.file.originalname,
              uploadedAt: new Date().toISOString(),
            },
          },
        });

        // Handle upload completion
        stream.on("error", (error) => {
          console.error("Upload error:", error);
          res.status(500).json({
            error: "Upload failed",
            message: "Failed to upload image to storage",
          });
        });

        stream.on("finish", async () => {
          try {
            // Make the file publicly accessible
            await file.makePublic();

            // Get the public URL
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

            // Create or update card with image URL
            const card = await processCard(publicUrl);

            res.status(200).json({
              message: "Card created with image successfully",
              data: {
                card: card,
                image: {
                  url: publicUrl,
                  fileName: fileName,
                  originalName: req.file.originalname,
                  size: req.file.size,
                  mimeType: req.file.mimetype,
                },
              },
            });
          } catch (error) {
            console.error("Error processing card with image:", error);
            res.status(500).json({
              error: "Upload completed but card processing failed",
              message: "Image uploaded but card creation/update failed",
            });
          }
        });

        // Upload the file
        stream.end(req.file.buffer);
      }
    } catch (error) {
      console.error("Card image upload route error:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to process card upload request",
      });
    }
  },
);

// DELETE /api/upload/image/:fileName - Delete image from Firebase Storage
router.delete("/image/:fileName(*)", authenticateToken, async (req, res) => {
  try {
    if (!isInitialized) {
      return res.status(503).json({
        error: "Service unavailable",
        message: "Firebase storage is not configured",
      });
    }

    const fileName = req.params.fileName;

    // Verify the file belongs to the user (check if path starts with their user ID)
    if (!fileName.startsWith(`wedding-cards/${req.user.id}/`)) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You can only delete your own images",
      });
    }

    const file = bucket.file(fileName);

    // Check if file exists
    const [exists] = await file.exists();
    if (!exists) {
      return res.status(404).json({
        error: "File not found",
        message: "The specified image does not exist",
      });
    }

    // Delete the file
    await file.delete();

    res.status(200).json({
      message: "Image deleted successfully",
      fileName: fileName,
      deletedBy: req.user.username,
      deletedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Delete image error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to delete image",
    });
  }
});

module.exports = router;
