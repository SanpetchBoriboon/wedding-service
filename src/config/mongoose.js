const mongoose = require("mongoose");

class MongooseConnection {
  constructor() {
    this.isConnected = false;
  }

  async connect() {
    try {
      if (!process.env.MONGODB_URI) {
        console.warn(
          "⚠️ MONGODB_URI not found. Running without database connection.",
        );
        return null;
      }

      if (this.isConnected) {
        console.log("✅ Using existing MongoDB connection");
        return mongoose.connection;
      }

      const options = {
        dbName: process.env.MONGODB_DB_NAME || "wedding_cards",
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      };

      await mongoose.connect(process.env.MONGODB_URI, options);

      this.isConnected = true;
      console.log("✅ Connected to MongoDB with Mongoose successfully");
      console.log(
        "📊 Database:",
        process.env.MONGODB_DB_NAME || "wedding_cards",
      );

      // Handle connection events
      mongoose.connection.on("connected", () => {
        console.log("📡 Mongoose connected to MongoDB");
      });

      mongoose.connection.on("error", (err) => {
        console.error("❌ Mongoose connection error:", err);
        this.isConnected = false;
      });

      mongoose.connection.on("disconnected", () => {
        console.log("📡 Mongoose disconnected from MongoDB");
        this.isConnected = false;
      });

      return mongoose.connection;
    } catch (error) {
      console.error(
        "❌ Error connecting to MongoDB with Mongoose:",
        error.message,
      );
      this.isConnected = false;
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this.isConnected) {
        await mongoose.disconnect();
        this.isConnected = false;
        console.log("✅ Disconnected from MongoDB");
      }
    } catch (error) {
      console.error("❌ Error disconnecting from MongoDB:", error.message);
      throw error;
    }
  }

  getConnection() {
    return mongoose.connection;
  }

  isConnectedToDatabase() {
    return this.isConnected && mongoose.connection.readyState === 1;
  }
}

// Export singleton instance
const mongooseConnection = new MongooseConnection();

module.exports = mongooseConnection;
