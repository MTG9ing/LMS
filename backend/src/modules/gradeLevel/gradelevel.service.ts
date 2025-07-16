import { ConflictError, DatabaseError, NotFoundError } from "../../Errors";
import { Prisma, PrismaClient } from "../../generated/prisma";
import { buildPaginatedResponse } from "../../utilities/responses/pagination.util";
import { buildSuccessResponse } from "../../utilities/responses/success.util";
import { CreateGradeLevelInput, UpdateGradeLevelInput } from "./gradelevel.dto";

export class GradeLevelService {
  constructor(private prisma: PrismaClient) {}

  // * DONE
  async create(data: CreateGradeLevelInput) {
    try {
      const gradelevel = await this.prisma.gradeLevel.findFirst({
        where: { OR: [{ name: data.name }, { order: data.order }] },
      });
      if (gradelevel)
        throw new ConflictError("Grade Level Already Exists", "Name or Order");

      const newGL = await this.prisma.gradeLevel.create({ data });
      return buildSuccessResponse(newGL, "Grade Level Created Successfully!");
    } catch (error) {}
  }

  // * DONE
  async all({
    page = 1,
    limit = 10,
    order = "name",
    sort = "desc",
  }: {
    page?: number;
    limit?: number;
    order: keyof Prisma.GradeLevelOrderByWithRelationInput;
    sort?: "asc" | "desc";
  }) {
    try {
      const [gradeLevel, total] = await Promise.all([
        this.prisma.gradeLevel.findMany({
          where: { isActive: true },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { [order]: sort },
          include: {
            students: true,
            Attendance: true,
            exams: true,
            homeworkTemplates: true,
          },
        }),
        this.prisma.gradeLevel.count(),
      ]);

      return buildPaginatedResponse(gradeLevel, {
        total,
        pageNumber: page,
        pageLimit: limit,
        order,
        sort,
      });
    } catch (error: DatabaseError | unknown) {
      throw new DatabaseError("Faild to get Grade Level: " + error, "All");
    }
  }

  // * DONE
  async byId(id: string) {
    try {
      const gradeLevel = await this.prisma.gradeLevel.findUnique({
        where: { id },
        include: {
          students: true,
          Attendance: true,
          exams: true,
          homeworkTemplates: true,
        },
      });

      if (!gradeLevel) throw new NotFoundError("Grade Level Not Found!");
      return buildSuccessResponse(gradeLevel, "Grade Level Found!");
    } catch (error: unknown | DatabaseError | NotFoundError) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError("Find Grade Level by id Failed", "Find By Id");
    }
  }

  // * DONE
  async update(id: string, data: UpdateGradeLevelInput) {
    try {
      const gradelevel = await this.prisma.gradeLevel.findUnique({
        where: { id },
      });
      if (!gradelevel) throw new NotFoundError("Could not find Grade Level");

      const updatedGradelevel = await this.prisma.gradeLevel.update({
        where: { id },
        data,
      });

      return buildSuccessResponse(
        updatedGradelevel,
        "Grade Level Updated Successfully!",
        { before: gradelevel }
      );
    } catch (error) {}
  }

  // * DONE
  async delete(id: string) {
    try {
      const gradeLevel = await this.prisma.gradeLevel.findUnique({
        where: { id },
      });
      if (!gradeLevel) throw new NotFoundError("Grade Level Not Found");

      const deletedGradeLevel = await this.prisma.gradeLevel.update({
        where: { id },
        data: { isActive: false },
      });

      return buildSuccessResponse(
        deletedGradeLevel,
        "GradeLevel (Soft Delete) Deleted Succefully!"
      );
    } catch (error: unknown | DatabaseError | NotFoundError) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError("Could not delete Grade Level", "Delete");
    }
  }
}
