import path from "path";
import fs from "fs";
import winston from "winston";
import morgan from "morgan";

// Create logs directory if it doesn't exist
const logDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Winston configuration
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      return `${timestamp} [${level.toUpperCase()}] ${stack || message}`;
    })
  ),
  transports: [
    // Error logs (only error level)
    new winston.transports.File({
      filename: path.join(logDir, "errors.log"),
      level: "error",
      handleExceptions: true,
      handleRejections: true,
    }),

    // HTTP logs (processed by Morgan)
    new winston.transports.File({
      filename: path.join(logDir, "http.log"),
      level: "http",
      format: winston.format.printf(({ message }) => message),
    }),

    // Application logs (info and above)
    new winston.transports.File({
      filename: path.join(logDir, "application.log"),
      level: "info",
    }),
  ],
});

// Morgan configuration for HTTP logging
const morganMiddleware = morgan(
  ":remote-addr :method :url :status :res[content-length] - :response-time ms",
  {
    stream: {
      write: (message: string) => logger.http(message.trim()),
    },
  }
);

// Add console logging in development
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

export { logger, morganMiddleware };
