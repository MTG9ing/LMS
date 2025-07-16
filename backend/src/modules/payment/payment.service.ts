import { TAX_RATE } from "../../configurations/env.config";
import { DatabaseError, NotFoundError } from "../../Errors";
import { CreatePayment, UpdatePayment } from "./payment.dto";
import { CreatePaymentSchema, UpdatePaymentSchema } from "./payment.validation";
import { buildSuccessResponse } from "../../utilities/responses/success.util";
import { buildPaginatedResponse } from "../../utilities/responses/pagination.util";
import { Prisma, PrismaClient } from "../../generated/prisma";

export class PaymentService {
  constructor(private prisma: PrismaClient) {}

  // * DONE
  async create(data: CreatePayment) {
    try {
      const validatedData = CreatePaymentSchema.parse(data);
      const plan = await this.prisma.paymentPlan.findUnique({
        where: { id: validatedData.planId },
      });
      if (!plan) {
        throw new NotFoundError("Could Not Find Payment Plan");
      }
      const payment = await this.prisma.payment.create({
        data: {
          ...validatedData,
          amount: plan.amount || validatedData?.amount,
          categoryId: plan.categoryId || validatedData.categoryId,
        },
      });
      const record = await this.prisma.financialRecord.create({
        data: {
          paymentId: payment.id,
          amount: payment.amount || validatedData?.amount,
          categoryId: payment.categoryId || "",
          taxAmount: payment.amount * TAX_RATE,
          type: payment.type,
        },
      });
      return buildSuccessResponse(payment, "Payment Created Successfully!", {
        record,
      });
    } catch (error: unknown | DatabaseError | NotFoundError) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError("Error Creating Payment", "Create");
    }
  }

  // * DONE
  async all({
    page = 1,
    limit = 10,
    type,
    method,
    isDeleted = false,
    order = "id",
    sort = "desc",
  }: {
    page?: number;
    limit?: number;
    type?: "INCOME" | "EXPENSE";
    method?: string;
    isDeleted?: boolean;
    order?: keyof Prisma.PaymentOrderByWithRelationInput;
    sort?: "asc" | "desc";
  }) {
    try {
      const where: Prisma.PaymentWhereInput = {
        isDeleted,
        ...(type && { type }),
        ...(method && { method }),
      };
      const skip = (page - 1) * limit;
      const [payments, totalCount] = await Promise.all([
        this.prisma.payment.findMany({
          include: {
            plan: true,
            category: true,
          },
          skip,
          take: limit,
          orderBy: {
            [order]: sort,
          },
          where,
        }),
        this.prisma.payment.count({ where }),
      ]);
      return buildPaginatedResponse(
        payments,
        {
          total: totalCount,
          pageNumber: page,
          pageLimit: limit,
          sort,
          order,
        },
        { type, method, isDeleted }
      );
    } catch (error: unknown | DatabaseError) {
      throw new DatabaseError("Error Fetching All Payments", "All");
    }
  }

  // * DONE
  async update(id: string, data: UpdatePayment) {
    try {
      const validatedData = UpdatePaymentSchema.parse(data);
      const payment = await this.prisma.payment.findUnique({
        where: { id },
      });
      if (!payment) throw new NotFoundError("Payment Not Found!");

      const updatedPayment = await this.prisma.payment.update({
        where: { id },
        data: validatedData,
      });
      return buildSuccessResponse(
        updatedPayment,
        "Payment Updated Successfully!",
        { before: payment }
      );
    } catch (error: unknown | DatabaseError | NotFoundError) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError("Error Updating Payment", "Update");
    }
  }

  // * DONE
  async delete(id: string) {
    try {
      const payment = await this.prisma.payment.findUnique({
        where: { id },
        include: {
          records: true,
        },
      });
      if (!payment) throw new NotFoundError("Payment Not Found!");

      await this.prisma.financialRecord.updateMany({
        where: {
          id: {
            in: payment.records.map((record: { id: string }) => record.id),
          },
        },
        data: {
          isDeleted: true,
        },
      });
      await this.prisma.payment.update({
        where: { id },
        data: {
          isDeleted: true,
        },
      });

      return buildSuccessResponse(
        payment,
        "Payment Deleted (Soft Deletion & Record) Successfully!"
      );
    } catch (error: unknown | DatabaseError | NotFoundError) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError("Error Deleting Payment", "Delete");
    }
  }
}
