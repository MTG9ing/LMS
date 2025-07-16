import {
  ConflictError,
  DatabaseError,
  NotFoundError,
  ValidationError,
} from "../../Errors";
import { Prisma, PrismaClient } from "../../generated/prisma";
import { decrypt, encrypt } from "../../utilities/encrypt.util";
import { buildPaginatedResponse } from "../../utilities/responses/pagination.util";
import { buildSuccessResponse } from "../../utilities/responses/success.util";
import { generateStudentNumber } from "../../utilities/studentNumberGenerator.util";
import { isValidPhone } from "../../utilities/validation.util";
import { StudentCreate, StudentUpdate } from "./student.dto";
import { StudentCreateSchema } from "./student.validations";

// TODO: find by student number
// TODO: create user attendance
// TODO: transfer validation into controller

export class StudentService {
  constructor(private prisma: PrismaClient) {}

  // * DONE
  async create(data: StudentCreate) {
    try {
      const studentNumber = await generateStudentNumber();

      await this.validateStudentCreation(data);

      const validatedData = StudentCreateSchema.parse({
        ...data,
        dateOfBirth: new Date(data.dateOfBirth),
        studentNumber,
      });

      const student = await this.prisma.student.create({
        data: {
          ...validatedData,
          sensitiveNotes: validatedData.sensitiveNotes
            ? encrypt(validatedData.sensitiveNotes)
            : "",
        },
        include: {
          gradeLevel: true,
          parent: true,
          paymentPlan: true,
        },
      });
      return buildSuccessResponse(
        {
          ...student,
          sensitiveNotes: student.sensitiveNotes
            ? decrypt(student.sensitiveNotes)
            : "",
        },
        "New Student Enrolled Successfully!"
      );
    } catch (error:
      | unknown
      | DatabaseError
      | NotFoundError
      | ConflictError
      | ValidationError) {
      if (
        error instanceof NotFoundError ||
        error instanceof ConflictError ||
        error instanceof ValidationError
      )
        throw error;
      throw new DatabaseError("Failed to create student: " + error, "create");
    }
  }

  // * DONE
  async all({
    // TODO: Fix Param Type
    page = 1,
    limit = 10,
    gradeLevelId,
    isStillAttending,
    isOnline,
    includeArchived,
    order = "createdAt",
    sort = "desc",
    search, // ✅ Add search
  }: {
    page?: number;
    limit?: number;
    gradeLevelId?: string;
    isStillAttending?: boolean;
    includeArchived?: boolean;
    isOnline?: boolean;
    order?: keyof Prisma.StudentOrderByWithRelationInput;
    sort?: "asc" | "desc";
    search?: string; // ✅ Optional search param
  }) {
    try {
      const where: Prisma.StudentWhereInput = {
        ...(includeArchived ? { isArchived: true } : { isArchived: false }),
        ...(gradeLevelId ? { gradeLevelId } : {}),
        ...(isOnline !== undefined ? { isOnline } : {}),
        ...(isStillAttending !== undefined ? { isStillAttending } : {}),
        ...(search
          ? {
              OR: [
                {
                  fullName: {
                    contains: search,
                  },
                },
                {
                  studentNumber: {
                    contains: search,
                  },
                },
              ],
            }
          : {}),
      };

      const [students, total] = await Promise.all([
        this.prisma.student.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          include: {
            parent: true,
            gradeLevel: true,
            paymentPlan: {
              include: {
                payments: true,
              },
            },
          },
          orderBy: { [order]: sort },
        }),
        this.prisma.student.count({ where }),
      ]);

      return buildPaginatedResponse(
        students.map((student) => ({
          ...student,
          sensitiveNotes: student.sensitiveNotes
            ? decrypt(student.sensitiveNotes)
            : "",
        })),
        {
          total,
          pageNumber: page,
          pageLimit: limit,
          order,
          sort,
        }
      );
    } catch (error: DatabaseError | unknown) {
      throw new DatabaseError("Failed to get Students: " + error, "All");
    }
  }

  // * DONE
  async byId(id: string) {
    try {
      const student = await this.prisma.student.findUnique({
        where: { id },
        include: {
          payments: {
            include: {
              records: true,
            },
          },
          parent: true,
          gradeLevel: true,
          exams: true,
          paymentPlan: true,
          homework: true,
          behaviors: true,
          achievements: true,
        },
      });
      if (!student) throw new NotFoundError("Student Not Found!");
      return buildSuccessResponse(
        {
          ...student,
          sensitiveNotes: student.sensitiveNotes
            ? decrypt(student.sensitiveNotes)
            : "Nothing",
        },
        "Student Found!"
      );
    } catch (error: unknown | DatabaseError | NotFoundError) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError("Find Student by id Failed", "Find By Id");
    }
  }

  // TODO: still didnt check it
  async search(
    query: string,
    options: { page: number; limit: number } = { page: 1, limit: 10 }
  ) {
    try {
      const where: Prisma.StudentWhereInput = {
        isArchived: false,
        OR: [
          { fullName: { contains: query } },
          { studentNumber: { contains: query } },
        ],
      };

      const [students, total] = await Promise.all([
        this.prisma.student.findMany({
          where,
          skip: (options.page - 1) * options.limit,
          take: options.limit,
          include: {
            gradeLevel: true,
            parent: true,
            paymentPlan: true,
          },
        }),
        this.prisma.student.count({ where }),
      ]);

      return buildPaginatedResponse(
        students.map((student) => ({
          ...student,
          sensitiveNotes: student.sensitiveNotes
            ? decrypt(student.sensitiveNotes)
            : "",
        })),
        {
          total,
          pageNumber: options.page,
          pageLimit: options.limit,
        }
      );
    } catch (error: DatabaseError | unknown) {
      throw new DatabaseError("Failed to search students: " + error, "search");
    }
  }

  // * DONE
  async update(id: string, data: StudentUpdate) {
    try {
      const student = await this.prisma.student.findUnique({
        where: { id },
        include: { gradeLevel: true, parent: true, paymentPlan: true },
      });
      if (!student) throw new NotFoundError("Student Not Found!");
      await this.validateStudentUpdate(student, data);

      if ("sensitiveNotes" in data && typeof data.sensitiveNotes === "string") {
        data.sensitiveNotes = encrypt(data.sensitiveNotes);
      }

      const updatedStudent = await this.prisma.student.update({
        where: { id },
        data,
      });

      return buildSuccessResponse(
        updatedStudent,
        "Student Updated Successfully!",
        { before: student }
      );
    } catch (error: unknown | DatabaseError | NotFoundError | ConflictError) {
      if (error instanceof NotFoundError || error instanceof ConflictError)
        throw error;
      throw new DatabaseError(
        `Failed to update student with ID: ${id} - Reason: ${error}`,
        "Update"
      );
    }
  }

  // * DONE
  async delete(id: string) {
    try {
      const student = await this.prisma.student.findUnique({ where: { id } });
      if (!student) throw new NotFoundError("Student Not Found!");
      const updatedStudent = await this.prisma.student.update({
        where: { id },
        data: { isArchived: true, archivedAt: new Date(Date.now()) },
      });

      return buildSuccessResponse(
        student,
        "Student Deleted (Soft Deletion) Succefully!"
      );
    } catch (error: unknown | DatabaseError | NotFoundError) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError("Could not delete Student", "Delete");
    }
  }

  // ================
  // Validation
  // ================
  private async validateStudentCreation(data: StudentCreate) {
    // Validate Payment Plan ID if provided
    if (data.paymentPlanId) {
      const paymentPlan = await this.prisma.paymentPlan.findUnique({
        where: { id: data.paymentPlanId },
      });
      if (!paymentPlan) throw new NotFoundError("Payment plan not found");
    }

    // Validate Phone number if provided
    if (data.phone && !isValidPhone(data.phone)) {
      throw new ValidationError(
        "Phone Number is not a valid Egyptian number!",
        "Phone"
      );
    }

    // Validate Email if provided
    if (data.email) {
      const exist = await this.prisma.student.findUnique({
        where: { email: data.email },
      });
      if (exist)
        throw new ConflictError("Student email already in use!", "Email");
    }

    // Validate Date of Birth if provided
    if (!data.dateOfBirth || isNaN(new Date(data.dateOfBirth).getTime())) {
      throw new ValidationError(
        "Provided Date is not a valid Date",
        "Date of Birth"
      );
    }
  }

  private async validateStudentUpdate(
    existing: Prisma.StudentGetPayload<{
      include: { parent: true; gradeLevel: true; paymentPlan: true };
    }>,
    data: Prisma.StudentUpdateInput
  ) {
    if (
      data.studentNumber &&
      data.studentNumber !== existing.studentNumber &&
      typeof data.studentNumber === "string"
    ) {
      const exists = await this.prisma.student.findUnique({
        where: { studentNumber: data.studentNumber },
      });
      if (exists)
        throw new ConflictError(
          "Student Number is actually taken",
          "Student Number"
        );
    }
    if (data.gradeLevel) {
      const grade = await this.prisma.gradeLevel.findUnique({
        where: { id: data.gradeLevel.connect?.id },
      });
      if (!grade) throw new NotFoundError("Grade level not found");
    }
    if (data.paymentPlan) {
      const plan = await this.prisma.paymentPlan.findUnique({
        where: { id: data.paymentPlan.connect?.id },
      });
      if (!plan) throw new NotFoundError("Payment plan not found");
    }
    if (data.parent && "connect" in data.parent && data.parent.connect?.id) {
      const parent = await this.prisma.parent.findUnique({
        where: { id: data.parent.connect.id },
      });
      if (!parent) throw new NotFoundError("Parent not found");
    }
  }
}
