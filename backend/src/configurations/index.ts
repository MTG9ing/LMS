import prisma from "./prisma.config";
import { Request, Response } from "express";

export class Configurations {
  static async healthCheckService() {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return {
        status: "OK",
        database: "CONNECTED",
        timestamp: new Date().toISOString(),
      };
    } catch (error: unknown | Error) {
      if (error instanceof Error)
        return {
          status: "ERROR",
          database: "DISCONNECTED",
          error: error.message,
        };
    }
  }

  static async healthCheckController(request: Request, response: Response) {
    try {
      const status = await this.healthCheckService();
      return response.status(200).json(status);
    } catch (error) {
      return response.status(500).json({ error: "Internal server error" });
    }
  }
}
