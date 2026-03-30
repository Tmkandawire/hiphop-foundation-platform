import mongoose from "mongoose";
import logger from "./logger.js";

/* -------------------------
   CONNECTION OPTIONS
------------------------- */
const MONGO_OPTIONS = {
  // How long to wait for initial connection (30s)
  serverSelectionTimeoutMS: 30000,

  // How long a socket stays inactive before closing (45s)
  socketTimeoutMS: 45000,

  // Max connection pool size
  maxPoolSize: 10,

  // Min connection pool size
  minPoolSize: 2,
};

/* -------------------------
   CONNECTION EVENTS
------------------------- */
const registerMongoEvents = () => {
  mongoose.connection.on("connected", () => {
    logger.info(`✅ MongoDB Connected: ${mongoose.connection.host}`);
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("⚠️ MongoDB Disconnected");
  });

  mongoose.connection.on("reconnected", () => {
    logger.info("🔄 MongoDB Reconnected");
  });

  mongoose.connection.on("error", (err) => {
    logger.error(`❌ MongoDB Error: ${err.message}`);
  });
};

/* -------------------------
   GRACEFUL SHUTDOWN
   Closes DB connection when
   server receives kill signal
------------------------- */
const registerShutdownHandlers = () => {
  const shutdown = async (signal) => {
    logger.warn(`${signal} received — closing MongoDB connection`);
    try {
      await mongoose.connection.close();
      logger.info("MongoDB connection closed. Exiting.");
      process.exit(0);
    } catch (err) {
      logger.error(`Error during shutdown: ${err.message}`);
      process.exit(1);
    }
  };

  process.on("SIGINT", () => shutdown("SIGINT")); // Ctrl+C
  process.on("SIGTERM", () => shutdown("SIGTERM")); // Deployment shutdown
};

/* -------------------------
   CONNECT
------------------------- */
// Singleton flag to prevent duplicate event listeners
let isInitialized = false;

const connectDB = async () => {
  try {
    // Only register listeners once, even if connectDB is called again
    if (!isInitialized) {
      registerMongoEvents();
      registerShutdownHandlers();
      isInitialized = true;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, MONGO_OPTIONS);

    return conn;
  } catch (error) {
    logger.error(`❌ MongoDB Connection Failed: ${error.message}`);
    // Throw so server.js .catch() handles final shutdown
    throw error;
  }
};

export default connectDB;
