import application from "./application";
import { Request, Response } from "express";
import { SERVER_HOST, SERVER_PORT } from "./configurations/env.config";
import { AppError } from "./Errors/App.error";
import { getLocalIp } from "./utilities/network.util";
import { logger } from "./utilities/logger.util";
import prisma from "./configurations/prisma.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { Configurations } from "./configurations";

application.get("/health", Configurations.healthCheckController);

application.use((request: Request, response: Response) => {
  throw new AppError("Resource not found", 404);
});

application.use(errorHandler);

const startServer = async () => {
  try {
    await prisma.$connect();
    logger.info("Database connected successfully");

    const server = application.listen(SERVER_PORT, () => {
      try {
        const localIp = getLocalIp();
        logger.info(`Local Network: http://${localIp}:${SERVER_PORT}`);
        logger.info(`Localhost: http://${SERVER_HOST}:${SERVER_PORT}`);
      } catch (error: unknown) {
        logger.warn(
          "IP Detection Failed:",
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    });

    // Graceful Shutdown
    const shutdown = async () => {
      logger.info("Graceful shutdown initiated");
      server.close(async () => {
        await prisma.$disconnect();
        logger.info("Server and DB connections closed");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    logger.error("Server Startup Failed:", error);
    process.exit(1);
  }
};

process.on("uncaughtException", (error) => {
  logger.error(`Uncaught Exception: ${error.message}`, error);
  process.exit(1);
});

process.on("unhandledRejection", (reason: unknown) => {
  logger.error("Unhandled Rejection:", {
    reason: reason instanceof Error ? reason.stack : reason,
  });
  process.exit(1);
});

startServer();
