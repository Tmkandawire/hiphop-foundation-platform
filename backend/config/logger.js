import winston from "winston";

/*
 Winston logger configuration
 Used for logging errors and important server events
*/

const logger = winston.createLogger({
  level: "info",

  format: winston.format.combine(
    winston.format.timestamp(),

    winston.format.errors({ stack: true }),

    winston.format.json(),
  ),

  transports: [
    // Write error logs to error.log
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),

    // Write all logs to combined.log
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

/*
 In development mode also log to console
*/

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

export default logger;
