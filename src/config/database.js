const { MongoClient } = require("mongodb");

class MongoDB {
  constructor() {
    this.client = null;
    this.db = null;
  }

  async connect() {
    try {
      if (!process.env.MONGODB_URI) {
        console.warn(
          "⚠️ MONGODB_URI not found. Running without database connection.",
        );
        return null;
      }

      this.client = new MongoClient(process.env.MONGODB_URI);

      await this.client.connect();
      this.db = this.client.db(process.env.MONGODB_DB_NAME || "wedding_cards");

      console.log("✅ Connected to MongoDB successfully");
      console.log(
        "📊 Database:",
        process.env.MONGODB_DB_NAME || "wedding_cards",
      );

      return this.db;
    } catch (error) {
      console.error("❌ MongoDB connection error:", error.message);
      console.warn(
        "⚠️ Continuing without database connection. API will use fallback data.",
      );
      return null;
    }
  }

  async disconnect() {
    try {
      if (this.client) {
        await this.client.close();
        console.log("🔌 Disconnected from MongoDB");
      }
    } catch (error) {
      console.error("❌ MongoDB disconnection error:", error);
    }
  }

  getDB() {
    if (!this.db) {
      console.warn("⚠️ Database not connected. Using fallback mode.");
      return null;
    }
    return this.db;
  }

  getCollection(name) {
    const db = this.getDB();
    if (!db) {
      return null;
    }
    return db.collection(name);
  }

  isConnected() {
    return this.db !== null;
  }

  async ping() {
    try {
      await this.getDB().admin().ping();
      return true;
    } catch (error) {
      console.error("❌ MongoDB ping failed:", error);
      return false;
    }
  }
}

// Create singleton instance
const mongodb = new MongoDB();

module.exports = mongodb;
