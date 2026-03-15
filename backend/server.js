import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import productRoutes from "./routes/productRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

// Adds security headers
app.use(helmet());

// Limit repeated API requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// Apply limiter to all routes
app.use(limiter);

// middleware
app.use(express.json());
app.use(cors());

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
