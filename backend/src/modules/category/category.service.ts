import { ConflictError, DatabaseError, NotFoundError } from "../../Errors";
import { Prisma, PrismaClient } from "../../generated/prisma";
import { buildPaginatedResponse } from "../../utilities/responses/pagination.util";
import { buildSuccessResponse } from "../../utilities/responses/success.util";
import { CreateCategoryInput, UpdateCategoryInput } from "./category.dto";
import {
  CreateCategorySchema,
  UpdateCategorySchema,
} from "./category.validation";

export class CategoryService {
  constructor(private prisma: PrismaClient) {}

  // * DONE
  async create(data: CreateCategoryInput) {
    try {
      const validatedData = CreateCategorySchema.parse(data);
      const existingCategory = await this.prisma.category.findUnique({
        where: { name: validatedData.name },
      });

      if (existingCategory) {
        throw new ConflictError(
          `Category: (${data.name}) Already Exists!`,
          "Name"
        );
      }

      const category = await this.prisma.category.create({
        data: validatedData,
      });

      return buildSuccessResponse(category, "New Category Has Been Added!");
    } catch (error: unknown | DatabaseError | ConflictError) {
      if (error instanceof ConflictError) throw error;

      throw new DatabaseError("Error Creating Category", "Create");
    }
  }

  // * DONE
  async all({
    page = 1,
    limit = 10,
    isActive = true,
    order = "createdAt",
    sort = "desc",
  }: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    order?: keyof Prisma.CategoryOrderByWithRelationInput;
    sort?: "asc" | "desc";
  }) {
    try {
      const skip: number = (page - 1) * limit;

      const [categories, total] = await Promise.all([
        this.prisma.category.findMany({
          where: { isActive },
          skip,
          take: limit,
          orderBy: {
            [order]: sort,
          },
        }),
        this.prisma.category.count({ where: { isActive } }),
      ]);

      return buildPaginatedResponse(
        categories,
        {
          total,
          pageNumber: page,
          pageLimit: limit,
          order,
          sort,
        },
        { isActive }
      );
    } catch (error: unknown | DatabaseError) {
      throw new DatabaseError("Error Fetching Categories", "All");
    }
  }

  // * DONE
  async byId(id: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!category) throw new NotFoundError("Category Not Found!");

      return buildSuccessResponse(category, "Category Found!");
    } catch (error: unknown | DatabaseError) {
      throw new DatabaseError("Error Fetching Category by ID", "By Id");
    }
  }

  // static async byName(name: string) {
  //   try {
  //     const category = await prisma.category.findUnique({
  //       where: { name },
  //     });

  //     if (!category) throw new NotFoundError("Category not found");

  //     return buildSuccessResponse(category, "Category Found!");
  //   } catch (error: unknown) {
  //     if (error instanceof Error) {
  //       console.error("Error fetching category by name:", error);
  //       throw new DatabaseError("Error Fetching Category by Name", "byName");
  //     }
  //   }
  // }

  // static async search(
  //   query: string,
  //   options?: {
  //     page?: number;
  //     limit?: number;
  //     orderBy?: "name" | "createdAt" | "updatedAt";
  //     sort?: "asc" | "desc";
  //   }
  // ) {
  //   try {
  //     const page: number = options?.page || 1;
  //     const limit: number = options?.limit || 10;
  //     const skip: number = (page - 1) * limit;

  //     const orderByField: string = options?.orderBy || "name";
  //     const sortDirection: string = options?.sort || "asc";

  //     const [categories, total] = await Promise.all([
  //       prisma.category.findMany({
  //         where: {
  //           name: {
  //             contains: query.toLowerCase(),
  //           },
  //         },
  //         skip,
  //         take: limit,
  //         orderBy: {
  //           [orderByField]: sortDirection,
  //         },
  //       }),
  //       prisma.category.count(),
  //     ]);

  //     return buildPaginatedResponse(categories, {
  //       total,
  //       pageNumber: page,
  //       pageLimit: limit,
  //       sortBy: options?.sort,
  //     });
  //   } catch (error: unknown) {
  //     if (error instanceof Error) {
  //       console.error("Error searching categories:", error);
  //       throw new DatabaseError("Error Searching Categories", "search");
  //     }
  //   }
  // }

  // * DONE
  async update(id: string, data: UpdateCategoryInput) {
    try {
      const validatedData = UpdateCategorySchema.parse(data);
      const category = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!category) {
        throw new NotFoundError("Category Not Found!");
      }

      const updatedCategory = await this.prisma.category.update({
        where: { id },
        data: validatedData,
      });

      return buildSuccessResponse(
        updatedCategory,
        "Category Updated Successfully!",
        { before: category }
      );
    } catch (error: unknown | NotFoundError | DatabaseError) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError("Error Updating Category", "Update");
    }
  }

  // * DONE
  async delete(id: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!category) {
        throw new NotFoundError("Category Not Found!");
      }

      await this.prisma.category.delete({
        where: { id },
      });

      return buildSuccessResponse(null, "Category Deleted Successfully!", {
        deletedCategory: category,
      });
    } catch (error: unknown | NotFoundError | DatabaseError) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError("Error Deleting Category", "Delete");
    }
  }
}
