const { ObjectId } = require("mongodb");
const mongodb = require("../config/database");

class Card {
  constructor(data) {
    this.title = data.title;
    this.message = data.message;
    this.template = data.template || "default";
    this.imageUrl = data.imageUrl || null; // Add image URL field
    this.createdBy = data.createdBy;
    this.userId = data.userId;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.status = data.status || "active";
  }

  // Save card to database
  async save() {
    try {
      const collection = mongodb.getCollection("cards");
      if (!collection) {
        // Fallback: return mock data
        return {
          _id: Date.now().toString(),
          ...this,
        };
      }

      const result = await collection.insertOne(this);

      return {
        _id: result.insertedId,
        ...this,
      };
    } catch (error) {
      console.error("Error saving card:", error);
      throw error;
    }
  }

  // Find all cards
  static async findAll(filter = {}) {
    try {
      const collection = mongodb.getCollection("cards");
      if (!collection) {
        // Fallback: return mock data
        return [
          {
            _id: "1",
            title: "Sample Wedding Card 1",
            message: "Join us for our special day!",
            template: "elegant",
            imageUrl: null,
            createdBy: "demo",
            userId: 1,
            status: "active",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            _id: "2",
            title: "Sample Wedding Card 2",
            message: "You're invited to celebrate with us!",
            template: "romantic",
            imageUrl: null,
            createdBy: "demo",
            userId: 1,
            status: "active",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];
      }

      const cards = await collection.find(filter).toArray();
      return cards;
    } catch (error) {
      console.error("Error finding cards:", error);
      throw error;
    }
  }

  // Find card by ID
  static async findById(id) {
    try {
      const collection = mongodb.getCollection("cards");
      const card = await collection.findOne({ _id: new ObjectId(id) });
      return card;
    } catch (error) {
      console.error("Error finding card by ID:", error);
      throw error;
    }
  }

  // Find cards by user ID
  static async findByUserId(userId) {
    try {
      const collection = mongodb.getCollection("cards");
      const cards = await collection.find({ userId: userId }).toArray();
      return cards;
    } catch (error) {
      console.error("Error finding cards by user ID:", error);
      throw error;
    }
  }

  // Update card
  static async updateById(id, updateData) {
    try {
      const collection = mongodb.getCollection("cards");
      updateData.updatedAt = new Date();

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData },
      );

      if (result.matchedCount === 0) {
        throw new Error("Card not found");
      }

      return await Card.findById(id);
    } catch (error) {
      console.error("Error updating card:", error);
      throw error;
    }
  }

  // Delete card
  static async deleteById(id) {
    try {
      const collection = mongodb.getCollection("cards");
      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        throw new Error("Card not found");
      }

      return { deleted: true };
    } catch (error) {
      console.error("Error deleting card:", error);
      throw error;
    }
  }

  // Count cards
  static async count(filter = {}) {
    try {
      const collection = mongodb.getCollection("cards");
      return await collection.countDocuments(filter);
    } catch (error) {
      console.error("Error counting cards:", error);
      throw error;
    }
  }

  // Create indexes
  static async createIndexes() {
    try {
      const collection = mongodb.getCollection("cards");

      // Index for user queries
      await collection.createIndex({ userId: 1 });

      // Index for created date
      await collection.createIndex({ createdAt: -1 });

      // Index for status
      await collection.createIndex({ status: 1 });

      console.log("📊 Card indexes created successfully");
    } catch (error) {
      console.error("Error creating indexes:", error);
      throw error;
    }
  }
}

module.exports = Card;
