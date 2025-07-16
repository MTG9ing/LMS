import {
  PaymentPlanQuerySchema,
  CreatePaymentPlanSchema,
  UpdatePaymentPlanSchema,
} from "./paymentPlan.validation";
import {
  CreatePaymentPlanInput,
  TPaymentPlan,
  PaymentPlanQuery,
  UpdatePaymentPlanInput,
} from "./paymentPlan.dto";
import { ConflictError, DatabaseError, NotFoundError } from "../../Errors";
import { buildPaginatedResponse } from "../../utilities/responses/pagination.util";
import { Prisma, PrismaClient } from "../../generated/prisma";
import { buildSuccessResponse } from "../../utilities/responses/success.util";

export class PaymentPlanService {
  constructor(private prisma: PrismaClient) {}

  // * DONE
  async create(data: CreatePaymentPlanInput) {
    try {
      const { categoryId, ...validatedData } =
        CreatePaymentPlanSchema.parse(data);
      const existingPaymentPlan: TPaymentPlan | null =
        await this.prisma.paymentPlan.findUnique({
          where: { name: validatedData.name },
        });

      if (existingPaymentPlan) {
        throw new ConflictError(
          `Payment Plan: (${data.name}) Already Exists.`,
          "Name"
        );
      }
      // const { categoryId, ...rest } = CreatePaymentPlanSchema.parse(data);
      const paymentPlan: TPaymentPlan = await this.prisma.paymentPlan.create({
        data: {
          ...validatedData,
          category: {
            connect: { id: categoryId },
          },
        },
        include: { category: true },
      });
      return buildSuccessResponse(paymentPlan, "Payment Plan Created!");
    } catch (error: unknown | ConflictError | DatabaseError) {
      if (error instanceof ConflictError) throw error;
      throw new DatabaseError("Error Creating Payment Plan", "Create");
    }
  }

  // * DONE
  async all({
    page = 1,
    limit = 10,
    type = "MONTHLY",
    isActive = true,
    isRecurring = true,
    min,
    max,
    order = "id",
    sort = "desc",
  }: {
    page?: number;
    limit?: number;
    type?: string;
    isActive?: boolean;
    min?: number;
    max?: number;
    isRecurring?: boolean;
    order?: keyof Prisma.PaymentPlanOrderByWithRelationInput;
    sort?: "asc" | "desc";
  }) {
    try {
      const skip: number = (page - 1) * limit;
      const take: number = limit;
      const where: any = {
        ...(type && { type }),
        ...(isActive && { isActive }),
        ...(isRecurring && { isRecurring }),
        ...(min || max
          ? {
              amount: {
                ...(min && {
                  gte: min,
                }),
                ...(max && {
                  lte: max,
                }),
              },
            }
          : {}),
      };

      const [paymentPlans, totalCount]: [TPaymentPlan[], number] =
        await Promise.all([
          this.prisma.paymentPlan.findMany({
            where,
            skip,
            take,
            orderBy: {
              [order]: sort,
            },
          }),
          this.prisma.paymentPlan.count({ where }),
        ]);

      return buildPaginatedResponse(
        paymentPlans,
        {
          total: paymentPlans.length,
          pageNumber: page,
          pageLimit: limit,
          sort,
          order,
        },
        {
          type,
          isActive,
          isRecurring,
          amount: { min, max },
        }
      );
    } catch (error: Error | unknown | DatabaseError) {
      throw new DatabaseError("Error Find All Payment Plans", "All");
    }
  }

  // * DONE
  async byId(id: string) {
    try {
      const paymentPlan: TPaymentPlan | null =
        await this.prisma.paymentPlan.findUnique({
          where: { id },
          include: { category: true },
        });
      if (!paymentPlan) throw new NotFoundError("Payment Plan Not Found!");
      return buildSuccessResponse(paymentPlan, "Payment Plan Found!");
    } catch (error: Error | unknown | NotFoundError | DatabaseError) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError("Error Finding Payment Plan", "By ID");
    }
  }

  // static async search(query: PaymentPlanQuery) {
  //   try {
  //     const {
  //       page = "1",
  //       limit = "10",
  //       orderBy = "name",
  //       sort = "asc",
  //       ...filters
  //     } = PaymentPlanQuerySchema.parse(query);

  //     const skip: number = (parseInt(page) - 1) * parseInt(limit);
  //     const take: number = parseInt(limit);

  //     const where: any = {
  //       ...(filters.name && {
  //         name: { contains: filters.name },
  //       }),
  //       ...(filters.type && { type: filters.type }),
  //       ...(filters.isActive !== undefined && {
  //         isActive: isTrue(filters.isActive),
  //       }),
  //       ...(filters.isRecurring !== undefined && {
  //         isRecurring: isTrue(filters.isRecurring),
  //       }),
  //       ...(filters.amountMin || filters.amountMax
  //         ? {
  //             amount: {
  //               ...(filters.amountMin && {
  //                 gte: parseFloat(filters.amountMin),
  //               }),
  //               ...(filters.amountMax && {
  //                 lte: parseFloat(filters.amountMax),
  //               }),
  //             },
  //           }
  //         : {}),
  //       ...(filters.categoryId && {
  //         category: { id: filters.categoryId },
  //       }),
  //     };

  //     const totalCount = await prisma.paymentPlan.count({ where });

  //     const paymentPlans: TPaymentPlan[] = await prisma.paymentPlan.findMany({
  //       where,
  //       skip,
  //       take,
  //       orderBy: {
  //         [orderBy]: sort,
  //       },
  //     });

  //     return buildPaginatedResponse(paymentPlans, {
  //       total: paymentPlans.length,
  //       pageNumber: Number(page),
  //       pageLimit: Number(limit),
  //     });
  //   } catch (error: Error | unknown) {
  //     if (error instanceof Error) {
  //       if (NODE_ENV !== "production")
  //         console.error("Error searching payment plans:", error);
  //       throw new DatabaseError("Error Searching Payment Plans", "search");
  //     }
  //   }
  // }

  // * DONE
  async update(id: string, data: UpdatePaymentPlanInput) {
    try {
      const { categoryId, ...validatedData } =
        UpdatePaymentPlanSchema.parse(data);
      const exists: TPaymentPlan | null =
        await this.prisma.paymentPlan.findUnique({
          where: { id },
        });
      if (!exists) throw new NotFoundError("Payment Plan Not Found");

      const dataToUpdate = {
        ...validatedData,
        ...(categoryId && { category: { connect: { id: categoryId } } }),
      };
      const paymentPlan: TPaymentPlan = await this.prisma.paymentPlan.update({
        where: { id },
        data: dataToUpdate,
        include: { category: true },
      });
      return buildSuccessResponse(paymentPlan, "Payment Plan Updated!", {
        before: exists,
      });
    } catch (error: Error | unknown | NotFoundError) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError("Error Updating Payment Plan", "Update");
    }
  }

  // * DONE
  async delete(id: string) {
    try {
      const exists: TPaymentPlan | null =
        await this.prisma.paymentPlan.findUnique({
          where: { id },
        });
      if (!exists) throw new NotFoundError("Payment Plan Not Found!");
      await this.prisma.paymentPlan.delete({
        where: { id },
      });
      return buildSuccessResponse(exists, "Payment Plan Deleted!");
    } catch (error: Error | unknown | NotFoundError | DatabaseError) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError("Error Deleting Payment Plan", "Delete");
    }
  }
}
