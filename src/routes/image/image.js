/**
 * @fileoverview Firebase Storage Image API Routes
 * @description Express.js router for handling image operations from Firebase Storage
 * including image retrieval, listing, and metadata operations
 * @author Wedding Card Service
 * @version 1.0.0
 */

const express = require("express");
const { bucket, isInitialized } = require("../../config/firebase");

const router = express.Router();

/**
 * @route GET /api/images
 * @description List all images from Firebase Storage with pagination
 * @access Public
 * @param {string} prefix - Optional prefix to filter images (query parameter)
 * @param {number} limit - Number of images to return (default: 50, max: 100)
 * @param {string} pageToken - Page token for pagination
 * @returns {Object} 200 - Success response with list of images
 * @returns {Object} 503 - Service unavailable (Firebase not configured)
 * @returns {Object} 500 - Internal server error
 * @example
 * GET /api/images?prefix=photo-all-wishes&limit=20
 *
 * Response:
 * {
 *   "message": "Images retrieved successfully",
 *   "images": [...],
 *   "count": 20,
 *   "nextPageToken": "token123"
 * }
 */
router.get("/", async (req, res) => {
  try {
    if (!isInitialized) {
      return res.status(503).json({
        error: "Service unavailable",
        message: "Firebase storage is not configured",
      });
    }

    const { prefix = "", limit = "50", pageToken } = req.query;
    const maxLimit = Math.min(parseInt(limit) || 50, 100);

    const options = {
      prefix: prefix,
      maxResults: maxLimit,
    };

    if (pageToken) {
      options.pageToken = pageToken;
    }

    const [files, , metadata] = await bucket.getFiles(options);

    const images = await Promise.all(
      files.map(async (file) => {
        try {
          const [metadata] = await file.getMetadata();
          const [exists] = await file.exists();

          // Get signed URL for secure access (optional)
          const [signedUrl] = await file.getSignedUrl({
            action: "read",
            expires: Date.now() + 1000 * 60 * 60, // 1 hour
          });

          return {
            name: file.name,
            size: parseInt(metadata.size) || 0,
            contentType: metadata.contentType || "unknown",
            timeCreated: metadata.timeCreated,
            updated: metadata.updated,
            publicUrl: `https://storage.googleapis.com/${bucket.name}/${file.name}`,
            signedUrl: signedUrl,
            exists: exists,
            metadata: metadata.metadata || {},
          };
        } catch (error) {
          console.warn(
            `Failed to get metadata for ${file.name}:`,
            error.message,
          );
          return {
            name: file.name,
            size: 0,
            contentType: "unknown",
            publicUrl: `https://storage.googleapis.com/${bucket.name}/${file.name}`,
            signedUrl: null,
            exists: false,
            error: "Failed to retrieve metadata",
          };
        }
      }),
    );

    res.json({
      message: "Images retrieved successfully",
      images: images,
      count: images.length,
      nextPageToken: metadata?.nextPageToken || null,
      prefix: prefix,
    });
  } catch (error) {
    console.error("Error listing images:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to retrieve images from storage",
    });
  }
});

/**
 * @route GET /api/images/:filename
 * @description Get specific image metadata and public URL from Firebase Storage
 * @access Public
 * @param {string} filename - The filename/path of the image in Firebase Storage
 * @returns {Object} 200 - Success response with image details
 * @returns {Object} 404 - Image not found
 * @returns {Object} 503 - Service unavailable (Firebase not configured)
 * @returns {Object} 500 - Internal server error
 * @example
 * GET /api/images/photo-all-wishes/uuid.jpg
 *
 * Response:
 * {
 *   "message": "Image found",
 *   "image": {
 *     "name": "photo-all-wishes/uuid.jpg",
 *     "size": 1024567,
 *     "contentType": "image/jpeg",
 *     "publicUrl": "https://storage.googleapis.com/...",
 *     "downloadUrl": "https://storage.googleapis.com/..."
 *   }
 * }
 */
router.get("/:filename(*)", async (req, res) => {
  try {
    if (!isInitialized) {
      return res.status(503).json({
        error: "Service unavailable",
        message: "Firebase storage is not configured",
      });
    }

    const fileName = req.params.filename;

    if (!fileName) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Filename is required",
      });
    }

    const file = bucket.file(fileName);

    // Check if file exists
    const [exists] = await file.exists();
    if (!exists) {
      return res.status(404).json({
        error: "Not Found",
        message: "Image not found in storage",
        filename: fileName,
      });
    }

    // Get file metadata
    const [metadata] = await file.getMetadata();

    // Get signed URL for secure access (optional)
    const [signedUrl] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 1000 * 60 * 60, // 1 hour
    });

    const imageData = {
      name: file.name,
      size: parseInt(metadata.size) || 0,
      contentType: metadata.contentType || "unknown",
      timeCreated: metadata.timeCreated,
      updated: metadata.updated,
      publicUrl: `https://storage.googleapis.com/${bucket.name}/${file.name}`,
      signedUrl: signedUrl,
      metadata: metadata.metadata || {},
    };

    res.json({
      message: "Image found",
      image: imageData,
    });
  } catch (error) {
    console.error("Error getting image:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to retrieve image information",
    });
  }
});

/**
 * @route GET /api/images/download/:filename
 * @description Download image directly from Firebase Storage
 * @access Public
 * @param {string} filename - The filename/path of the image in Firebase Storage
 * @returns {File} 200 - Image file stream
 * @returns {Object} 404 - Image not found
 * @returns {Object} 503 - Service unavailable (Firebase not configured)
 * @returns {Object} 500 - Internal server error
 * @example
 * GET /api/images/download/photo-all-wishes/uuid.jpg
 */
router.get("/download/*", async (req, res) => {
  try {
    if (!isInitialized) {
      return res.status(503).json({
        error: "Service unavailable",
        message: "Firebase storage is not configured",
      });
    }

    // Get filename from the wildcard parameter
    const fileName = req.params[0];
    if (!exists) {
      return res.status(404).json({
        error: "Not Found",
        message: "Image not found in storage",
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
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${file.name.split("/").pop()}"`,
    );

    // Stream the file directly to response
    const stream = file.createReadStream();

    stream.on("error", (error) => {
      console.error("Stream error:", error);
      if (!res.headersSent) {
        res.status(500).json({
          error: "Stream error",
          message: "Failed to stream image",
        });
      }
    });

    stream.pipe(res);
  } catch (error) {
    console.error("Error downloading image:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to download image",
      });
    }
  }
});

/**
 * @route DELETE /api/images/:filename
 * @description Delete image from Firebase Storage
 * @access Public
 * @param {string} filename - The filename/path of the image to delete
 * @returns {Object} 200 - Success response
 * @returns {Object} 404 - Image not found
 * @returns {Object} 503 - Service unavailable (Firebase not configured)
 * @returns {Object} 500 - Internal server error
 * @example
 * DELETE /api/images/photo-all-wishes/uuid.jpg
 *
 * Response:
 * {
 *   "message": "Image deleted successfully",
 *   "filename": "photo-all-wishes/uuid.jpg"
 * }
 */
router.delete("/*", async (req, res) => {
  try {
    if (!isInitialized) {
      return res.status(503).json({
        error: "Service unavailable",
        message: "Firebase storage is not configured",
      });
    }

    // Get filename from the wildcard parameter
    const fileName = req.params[0];

    // Delete the file
    await file.delete();

    res.json({
      message: "Image deleted successfully",
      filename: fileName,
      deletedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to delete image",
    });
  }
});

/**
 * @module ImageRouter
 * @description Express router module for Firebase Storage image API endpoints
 * @exports {Object} router - Express router instance with configured image routes
 */
module.exports = router;
