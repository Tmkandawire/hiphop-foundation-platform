// middleware/requestLogger.js
import morgan from "morgan";
import logger from "../config/logger.js";

/*
 Express request logger middleware
 Logs HTTP requests and writes them to Winston
*/

const stream = {
  write: (message) => logger.info(message.trim()),
};

const requestLogger = morgan("combined", { stream });

export default requestLogger;
