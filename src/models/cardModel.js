const mongoose = require("mongoose");

// Card Schema
const cardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    template: {
      type: String,
      default: "default",
    },
    imageUrl: {
      type: String,
      default: null,
    },
    createdBy: {
      type: String,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "deleted"],
      default: "active",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  },
);

// Index for better performance
cardSchema.index({ userId: 1 });
cardSchema.index({ createdAt: -1 });
cardSchema.index({ status: 1 });

// Static methods
cardSchema.statics.findAll = function (filter = {}) {
  // Sort by createdAt descending (newest first)
  return this.find(filter).sort({ createdAt: -1 });
};

const Card = mongoose.model("Card", cardSchema);

module.exports = Card;
