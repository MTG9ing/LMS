import { Request, Response, NextFunction } from "express";
import { AttendanceService } from "./attendance.service";
import prisma from "../../configurations/prisma.config";

const service = new AttendanceService(prisma);
export class AttendanceController {
  // * DONE
  static async recordAttendance(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { gradeLevelId, date, studentId } = request.body;

      const result = await service.recordAttendance({
        gradeLevelId,
        date,
        studentId,
      });
      response.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  // * DONE
  static async getAttendanceByDate(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { gradeLevelId, date } = request.params;

      const result = await service.getAttendanceByDate({
        gradeLevelId,
        date,
      });

      response.json(result);
    } catch (error) {
      next(error);
    }
  }
}
