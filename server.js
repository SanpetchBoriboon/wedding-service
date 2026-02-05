require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

// Import mongoose database connection
const mongooseConnection = require("./src/config/mongoose");

// Import routes
const apiRoutes = require("./src/routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Wedding Card Online Service",
    status: "API is running",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api", apiRoutes);

// Health check
app.get("/health", async (req, res) => {
  try {
    const dbConnected = mongooseConnection.isConnectedToDatabase();

    res.status(200).json({
      status: "OK",
      uptime: process.uptime(),
      timestamp: Date.now(),
      database: {
        connected: dbConnected,
        name: process.env.MONGODB_DB_NAME || "wedding_cards",
      },
    });
  } catch (error) {
    res.status(503).json({
      status: "Service Unavailable",
      uptime: process.uptime(),
      timestamp: Date.now(),
      database: {
        connected: false,
        error: error.message,
      },
    });
  }
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// Start server with database connection
async function startServer() {
  try {
    // Try to connect to MongoDB with Mongoose
    const db = await mongooseConnection.connect();

    if (mongooseConnection.isConnectedToDatabase()) {
      console.log("✅ Database connection established");
    } else {
      console.warn("⚠️ Running in fallback mode without database");
    }

    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`Wedding Card Service is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`Access the API at: http://localhost:${PORT}`);
      console.log(
        `Database: ${mongooseConnection.isConnectedToDatabase() ? "Connected" : "Fallback mode"}`,
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("🛑 Received SIGTERM. Shutting down gracefully...");
  await mongooseConnection.disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("🛑 Received SIGINT. Shutting down gracefully...");
  await mongooseConnection.disconnect();
  process.exit(0);
});

// Start the server
startServer();

module.exports = app;
