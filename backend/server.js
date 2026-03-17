import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import requestLogger from "./middleware/requestLogger.js";
import { apiLimiter } from "./middleware/rateLimitMiddleware.js";

import { errorHandler } from "./middleware/errorMiddleware.js";

import productRoutes from "./routes/productRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(cors());
// Adds security headers
app.use(helmet());

// Request logging middleware
app.use(requestLogger);

// Apply rate limiter to all routes
app.use("/api", apiLimiter);

// Health check route
app.get("/", (req, res) => {
  res.json({
    message: "HipHop Foundation API is running",
  });
});

/* -------------------------
   API Routes
-------------------------*/

app.use("/api/product", productRoutes);
app.use("/api/post", postRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/admin", adminRoutes);

/* -------------------------------
   404 Middleware
--------------------------------*/
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

/* -------------------------------
   Global Error Handler
--------------------------------*/

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

/* -------------------------
   Start Server
-------------------------*/

// connect database
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
      );
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1); // Stop the server if the DB fails
  });
