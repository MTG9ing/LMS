import { Request, Response, NextFunction } from "express";
import { FinancialRecordService } from "./financialRecord.service";
import prisma from "../../configurations/prisma.config";

const record = new FinancialRecordService(prisma);
export class FinancialRecordController {
  // * DONE
  static async getAll(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const records = await record.all(request.query);
      response.status(200).json(records);
    } catch (error) {
      next(error);
    }
  }

  // * DONE
  static async getById(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const financialRecord = await record.byId(request.params.id);
      response.status(200).json(financialRecord);
    } catch (error) {
      next(error);
    }
  }

  // * DONE
  static async createRecord(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const FinancialRecord = await record.create(request.body);
      response.status(201).json(FinancialRecord);
    } catch (error) {
      next(error);
    }
  }

  // * DONE
  static async recordSummary(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const summary = await record.summary();
      response.status(200).json(summary);
    } catch (error) {
      next(error);
    }
  }

  // * DONE
  static async updateRecord(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const financialRecord = await record.update(
        request.params.id,
        request.body
      );
      response.status(200).json(financialRecord);
    } catch (error) {
      next(error);
    }
  }

  // * DONE
  static async deleteRecord(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      await record.delete(request.params.id);
      response.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
