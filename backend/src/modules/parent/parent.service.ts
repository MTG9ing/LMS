import { DatabaseError, NotFoundError, ValidationError } from "../../Errors";
import { Prisma, PrismaClient } from "../../generated/prisma";
import { buildPaginatedResponse } from "../../utilities/responses/pagination.util";
import { buildSuccessResponse } from "../../utilities/responses/success.util";
import { isValidPhone } from "../../utilities/validation.util";
import { CreateParent, UpdateParent } from "./parent.dto";

export class ParentService {
  constructor(private prisma: PrismaClient) {}

  // * DONE
  async create(data: CreateParent) {
    try {
      if (data.primaryPhone && !isValidPhone(data.primaryPhone)) {
        throw new ValidationError(
          "Phone Number is not a valid Egyptian number!",
          "Phone"
        );
      }
      if (data.secondaryPhone && !isValidPhone(data.secondaryPhone)) {
        throw new ValidationError(
          "Phone Number is not a valid Egyptian number!",
          "Phone"
        );
      }

      const parent = await this.prisma.parent.create({
        data,
        include: { students: true },
      });

      return buildSuccessResponse(parent, "New Parent Joined Successfully!");
    } catch (error: unknown | DatabaseError | ValidationError) {
      if (error instanceof ValidationError) throw error;
      throw new DatabaseError("Failed to create Parent: " + error, "create");
    }
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
    order: keyof Prisma.ParentOrderByWithRelationInput;
    sort?: "asc" | "desc";
  }) {
    try {
      const [parents, total] = await Promise.all([
        this.prisma.parent.findMany({
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { [order]: sort },
          include: {
            students: true,
          },
        }),
        this.prisma.parent.count(),
      ]);

      return buildPaginatedResponse(parents, {
        total,
        pageNumber: page,
        pageLimit: limit,
        order,
        sort,
      });
    } catch (error: DatabaseError | unknown) {
      throw new DatabaseError("Faild to get Parents: " + error, "All");
    }
  }

  // * DONE
  async byId(id: string) {
    try {
      const parent = await this.prisma.parent.findUnique({
        where: { id },
        include: { students: true },
      });

      if (!parent) throw new NotFoundError("Parent Not Found!");
      return buildSuccessResponse(parent, "Parent Found!");
    } catch (error: unknown | DatabaseError | NotFoundError) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError("Find Parent by id Failed", "Find By Id");
    }
  }

  // * DONE
  async update(id: string, data: UpdateParent) {
    try {
      const parent = await this.prisma.parent.findUnique({
        where: { id },
        include: { students: true },
      });
      if (!parent) throw new NotFoundError("Parent Not Found!");
      const updatedParent = await this.prisma.parent.update({
        where: { id },
        data,
      });

      return buildSuccessResponse(
        updatedParent,
        "Parent Updated Successfully!",
        { before: parent }
      );
    } catch (error) {}
  }

  // * DONE
  async delete(id: string) {
    try {
      const parent = await this.prisma.parent.findUnique({
        where: { id },
        include: { students: true },
      });
      if (!parent) throw new NotFoundError("Parent Not Found");

      parent.students.forEach((student) => {
        this.prisma.student.update({
          where: { id: student.id },
          data: { isArchived: true, archivedAt: new Date(Date.now()) },
        });
      });

      const deletedParent = await this.prisma.parent.delete({ where: { id } });

      return buildSuccessResponse(
        deletedParent,
        "Parent (+Student Archieved) Deleted Succefully!"
      );
    } catch (error: unknown | DatabaseError | NotFoundError) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError("Could not delete Parent", "Delete");
    }
  }
}
