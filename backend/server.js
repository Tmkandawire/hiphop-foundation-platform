import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";

import requestLogger from "./middleware/requestLogger.js";
import { apiLimiter } from "./middleware/rateLimitMiddleware.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

import productRoutes from "./routes/productRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";

dotenv.config();

const app = express();

/* -------------------------
   TRUST PROXY (Production)
-------------------------*/
app.set("trust proxy", 1);

/* -------------------------
   BODY PARSING (Safer Limits)
-------------------------*/
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

/* -------------------------
   COOKIE PARSER (🔥 REQUIRED)
-------------------------*/
app.use(cookieParser());

/* -------------------------
   CORS (Dynamic + Secure)
-------------------------*/
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

/* -------------------------
   HELMET (Hardened)
-------------------------*/
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

/* -------------------------
   REQUEST LOGGER
-------------------------*/
app.use(requestLogger);

/* -------------------------
   RATE LIMITING
-------------------------*/
app.use("/api", apiLimiter);

/* -------------------------
   HEALTH CHECK
-------------------------*/
app.get("/", (req, res) => {
  res.json({
    message: "HipHop Foundation API is running",
  });
});

/* -------------------------
   ROUTES
-------------------------*/
app.use("/api/products", productRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/admin/posts", postRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/gallery", galleryRoutes);

/* -------------------------
   404 HANDLER
-------------------------*/
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

/* -------------------------
   GLOBAL ERROR HANDLER
-------------------------*/
app.use(errorHandler);

/* -------------------------
   START SERVER
-------------------------*/
const PORT = process.env.PORT || 5000;

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
    process.exit(1);
  });
