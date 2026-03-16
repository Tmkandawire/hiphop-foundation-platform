import rateLimit from "express-rate-limit";

// Global API rate limiter
export const apiLimiter = rateLimit({
  // Time window
  windowMs: 15 * 60 * 1000, // 15 minutes

  // Max requests per IP
  max: 100,

  // Response message
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again later.",
  },

  // Return rate limit info in headers
  standardHeaders: true,

  // Disable legacy headers
  legacyHeaders: false,
});

// Login-specific rate limiter

export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,

  message: {
    message: "Too many login attempts. Try again later.",
  },
});
