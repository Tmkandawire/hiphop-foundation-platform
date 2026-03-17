import logger from "../config/logger.js";

export const errorHandler = (err, req, res, next) => {
  // Print error in server console
  logger.error(err.stack);

  // Send structured JSON error response
  res.status(500).json({
    success: false,
    message: err.message || "Server Error",
  });
};
