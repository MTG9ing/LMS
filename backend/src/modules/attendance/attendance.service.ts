import { DatabaseError } from "../../Errors";
import { PrismaClient } from "../../generated/prisma";
import { buildPaginatedResponse } from "../../utilities/responses/pagination.util";
import { buildSuccessResponse } from "../../utilities/responses/success.util";

// TODO: refactor this code (the entire module)

type AttendanceInput = {
  gradeLevelId: string;
  date: string; // ISO format
  studentId: string;
};
export class AttendanceService {
  constructor(private prisma: PrismaClient) {}

  // * DONE
  async recordAttendance({ gradeLevelId, date, studentId }: AttendanceInput) {
    try {
      const dateObj = new Date(date);

      const exists = await this.prisma.attendance.findFirst({
        where: { studentId, gradeLevelId, date: dateObj },
      });

      if (exists) {
        const deleted = await this.prisma.attendance.delete({
          where: {
            id: exists.id,
          },
        });
        return buildSuccessResponse(deleted, "Attendance Deleted!");
      }

      const created = await this.prisma.attendance.create({
        data: {
          student: {
            connect: {
              id: studentId,
            },
          },
          date: dateObj,
          gradeLevel: {
            connect: {
              id: gradeLevelId,
            },
          },
        },
      });

      return buildSuccessResponse(created, "Attendance Recorded!");
    } catch (error: DatabaseError | unknown) {
      throw new DatabaseError(
        "Error Toggling Attendance!",
        "Record Attendance"
      );
    }
  }

  // * DONE
  async getAttendanceByDate({
    gradeLevelId,
    date,
  }: {
    gradeLevelId: string;
    date: string;
  }) {
    try {
      const dateObj = new Date(date);

      const [attendances, total] = await Promise.all([
        this.prisma.attendance.findMany({
          where: {
            gradeLevelId,
            date: dateObj,
          },
          select: {
            date: true,
            studentId: true,
            student: {
              select: {
                id: true,
                fullName: true,
                phone: true,
                isOnline: true,
                studentNumber: true,
                isStillAttending: true,
              },
            },
            gradeLevelId: true,
            gradeLevel: {
              select: { name: true, isActive: true, order: true },
            },
          },
        }),
        this.prisma.attendance.count({
          where: {
            gradeLevelId,
            date: dateObj,
          },
        }),
      ]);

      return buildPaginatedResponse(attendances, {
        total,
      });
    } catch (error: unknown | DatabaseError) {
      throw new DatabaseError(
        "Error Fetching Attendance List!",
        "All Attendance"
      );
    }
  }
}
