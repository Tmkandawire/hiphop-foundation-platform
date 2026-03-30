import rateLimit from "express-rate-limit";

/* -------------------------
   GLOBAL API LIMITER
------------------------- */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,

  // Skip rate limiting in test environments
  skip: () => process.env.NODE_ENV === "test",

  message: {
    success: false,
    message: "Too many requests from this IP. Please try again later.",
  },

  // Use a custom key generator that falls back gracefully
  keyGenerator: (req) => {
    return req.ip || req.headers["x-forwarded-for"] || "unknown";
  },

  handler: (req, res) => {
    const resetTime = req.rateLimit.resetTime;
    const secondsLeft = Math.ceil((resetTime - Date.now()) / 1000);

    res.status(429).json({
      success: false,
      message: "Too many requests from this IP. Please try again later.",
      retryAfter: secondsLeft,
    });
  },
});

/* -------------------------
   LOGIN LIMITER
------------------------- */
export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,

  skip: () => process.env.NODE_ENV === "test",

  // Don't count successful logins against the limit
  skipSuccessfulRequests: true,

  message: {
    success: false,
    message: "Too many login attempts. Please try again in 10 minutes.",
  },

  handler: (req, res) => {
    const resetTime = req.rateLimit.resetTime;
    const secondsLeft = Math.ceil((resetTime - Date.now()) / 1000);

    res.status(429).json({
      success: false,
      message: "Too many login attempts. Please try again in 10 minutes.",
      code: "TOO_MANY_ATTEMPTS",
      retryAfter: secondsLeft,
    });
  },
});

/* -------------------------
   GALLERY UPLOAD LIMITER
------------------------- */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,

  skip: () => process.env.NODE_ENV === "test",

  message: {
    success: false,
    message: "Upload limit reached. Please try again in an hour.",
  },

  handler: (req, res) => {
    const resetTime = req.rateLimit.resetTime;
    const secondsLeft = Math.ceil((resetTime - Date.now()) / 1000);

    res.status(429).json({
      success: false,
      message: "Upload limit reached. Please try again in an hour.",
      code: "UPLOAD_LIMIT_REACHED",
      retryAfter: secondsLeft,
    });
  },
});
