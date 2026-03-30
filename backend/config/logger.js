import winston from "winston";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

/* -------------------------
   SETUP LOGS DIRECTORY
   Ensures /logs exists before
   Winston tries to write to it
------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDir = path.join(__dirname, "..", "..", "logs");

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/* -------------------------
   CUSTOM FORMATS
------------------------- */

// Strips sensitive fields before writing to log files
const sanitizeFields = winston.format((info) => {
  const sensitive = ["password", "token", "secret", "authorization", "cookie"];
  sensitive.forEach((field) => {
    if (info[field]) info[field] = "[REDACTED]";
    if (info.body?.[field]) info.body[field] = "[REDACTED]";
  });
  return info;
});

// Pretty console format for development
const devConsoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return stack
      ? `[${timestamp}] ${level}: ${message}\n${stack}`
      : `[${timestamp}] ${level}: ${message}`;
  }),
);

// Structured JSON format for production files
const prodFileFormat = winston.format.combine(
  sanitizeFields(),
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

/* -------------------------
   LOGGER INSTANCE
------------------------- */
const logger = winston.createLogger({
  // Use warn level in production to reduce noise
  level: process.env.NODE_ENV === "production" ? "warn" : "info",

  format: prodFileFormat,

  transports: [
    // Error logs only
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
      // Auto-rotate — keep max 5 files of 5MB each
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),

    // All logs combined
    new winston.transports.File({
      filename: path.join(logsDir, "combined.log"),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
    }),
  ],

  // Prevents logger crashes from taking down the server
  exitOnError: false,
});

/* -------------------------
   DEVELOPMENT CONSOLE
------------------------- */
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: devConsoleFormat,
    }),
  );
}

/* -------------------------
   HANDLE UNCAUGHT EXCEPTIONS
   AND UNHANDLED REJECTIONS
------------------------- */
logger.exceptions.handle(
  new winston.transports.File({
    filename: path.join(logsDir, "exceptions.log"),
    maxsize: 5 * 1024 * 1024,
    maxFiles: 3,
  }),
);

logger.rejections.handle(
  new winston.transports.File({
    filename: path.join(logsDir, "rejections.log"),
    maxsize: 5 * 1024 * 1024,
    maxFiles: 3,
  }),
);

export default logger;
