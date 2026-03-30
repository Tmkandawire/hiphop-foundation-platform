import morgan from "morgan";
import logger from "../config/logger.js";

/* -------------------------
   SENSITIVE PATHS TO SKIP
------------------------- */
const SKIP_PATHS = ["/favicon.ico", "/health", "/"];

/* -------------------------
   CUSTOM TOKEN — Request ID
   Helps trace a single request
   across multiple log entries
------------------------- */
morgan.token("request-id", (req) => req.headers["x-request-id"] || "none");

/* -------------------------
   CUSTOM TOKEN — Sanitized URL
   Strips sensitive query params
   e.g. ?token=abc&password=123
------------------------- */
morgan.token("safe-url", (req) => {
  try {
    const host = req.headers.host || "localhost";
    const url = new URL(req.originalUrl, `http://${host}`);

    const sensitiveParams = ["token", "password", "secret", "key", "auth"];
    sensitiveParams.forEach((param) => url.searchParams.delete(param));

    return url.pathname + url.search;
  } catch {
    return req.originalUrl;
  }
});

/* -------------------------
   LOG FORMAT
------------------------- */
const LOG_FORMAT =
  process.env.NODE_ENV === "production"
    ? // Production: structured, machine-readable
      ":remote-addr :method :safe-url :status :res[content-length] :response-time ms"
    : // Development: human-readable with colors
      "dev";

/* -------------------------
   STREAM TO WINSTON
------------------------- */
const stream = {
  write: (message) => logger.info(message.trim()),
};

/* -------------------------
   SKIP FUNCTION
------------------------- */
const skip = (req) => {
  // Skip non-essential paths
  if (SKIP_PATHS.includes(req.path)) return true;

  // Skip health checks and static assets
  if (req.path.startsWith("/static")) return true;

  return false;
};

/* -------------------------
   EXPORT MIDDLEWARE
------------------------- */
const requestLogger = morgan(LOG_FORMAT, { stream, skip });

export default requestLogger;
