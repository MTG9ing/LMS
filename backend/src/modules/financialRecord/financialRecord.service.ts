import { TAX_RATE } from "../../configurations/env.config";
import { ConflictError, DatabaseError, NotFoundError } from "../../Errors";
import { PrismaClient } from "../../generated/prisma";
import { buildPaginatedResponse } from "../../utilities/responses/pagination.util";
import { buildSuccessResponse } from "../../utilities/responses/success.util";
import {
  CreateFinancialRecord,
  FinancialRecordQuery,
  UpdateFinancialRecord,
} from "./financialRecord.dto";
import { FinancialRecordQuerySchema } from "./financialRecord.validation";

// TODO: Financial Record is read-only

export class FinancialRecordService {
  constructor(private prisma: PrismaClient) {}

  // * DONE
  async create(data: CreateFinancialRecord) {
    try {
      let payment;
      if (data.paymentId) {
        payment = await this.prisma.payment.findUnique({
          where: { id: data.paymentId },
          include: { records: true },
        });
      }
      if (payment && payment.records.length > 0) {
        throw new ConflictError(
          "Payment already linked to a record!",
          "PaymentID"
        );
      }
      const record = await this.prisma.financialRecord.create({
        data: {
          ...data,
          amount: payment ? payment.amount : data.amount,
          type: payment ? payment.type : data.type,
          description: payment ? payment.description : data.description,
          categoryId:
            payment && payment.categoryId !== null
              ? payment.categoryId
              : data.categoryId,
          date: payment ? payment.paymentDate : data.date,
          taxAmount: TAX_RATE,
        },
      });
      return buildSuccessResponse(record, "Record Created Successfully!");
    } catch (error: unknown | DatabaseError | ConflictError) {
      if (error instanceof ConflictError) throw error;
      throw new DatabaseError("Failed to Create Financial Record!", "Create");
    }
  }

  // * DONE
  async all(query: FinancialRecordQuery) {
    try {
      const {
        page = 1,
        limit = 10,
        sort = "date",
        order = "desc",
        from,
        to,
        type,
        categoryId,
        ...rest
      } = FinancialRecordQuerySchema.parse(query);

      const usableLimit = limit > 100 ? 100 : limit;

      const whereClause: {
        date?: { gte: Date; lte: Date };
        transactionType?: string;
        categoryId?: string;
        isDeleted?: boolean;
      } = { ...rest, isDeleted: false };

      if (from && to) {
        whereClause.date = {
          gte: new Date(from),
          lte: new Date(to),
        };
      }

      if (type) {
        whereClause.transactionType = type;
      }

      if (categoryId) {
        whereClause.categoryId = categoryId;
      }

      const records = await this.prisma.financialRecord.findMany({
        where: whereClause,
        orderBy: { [sort]: order },
        skip: (page - 1) * limit,
        take: usableLimit,
        include: {
          category: true,
          payment: true,
        },
      });
      const totalRecords = await this.prisma.financialRecord.count({
        where: whereClause,
      });
      return buildPaginatedResponse(
        records,
        {
          total: totalRecords,
          pageNumber: page,
          pageLimit: usableLimit,
        },
        {
          fromRecord: (page - 1) * limit + 1,
          toRecord: Math.min(page * limit, totalRecords),
        }
      );
    } catch (error: unknown | DatabaseError) {
      throw new DatabaseError("Failed to Fetch All Financial Records!", "All");
    }
  }

  // * DONE
  async summary() {
    try {
      const [totalIncome, totalExpense, totalTax] = await Promise.all([
        this.prisma.financialRecord.aggregate({
          _sum: {
            amount: true,
            taxAmount: true,
          },
          where: { isDeleted: false, type: "INCOME" },
        }),
        this.prisma.financialRecord.aggregate({
          _sum: {
            amount: true,
          },
          where: { isDeleted: false, type: "EXPENSE" },
        }),
        this.prisma.financialRecord.aggregate({
          _sum: {
            taxAmount: true,
          },
          where: { isDeleted: false, type: "INCOME" },
        }),
      ]);

      const totalIncomeAmount = totalIncome._sum.amount ?? 0;
      const totalExpenseAmount = totalExpense._sum.amount ?? 0;
      const totalTaxAmount = totalTax._sum.taxAmount ?? 0;

      return buildSuccessResponse(
        {
          balance: {
            preTax: totalIncomeAmount - totalExpenseAmount,
            postTax: totalIncomeAmount - (totalExpenseAmount + totalTaxAmount),
          },
        },
        "All Records Summary",
        {
          totalIncome: totalIncomeAmount,
          totalExpense: totalExpenseAmount,
          totalTax: totalTaxAmount,

          totalRecords: await this.prisma.financialRecord.count({
            where: { isDeleted: false },
          }),
        }
      );
    } catch (error: unknown | DatabaseError) {
      throw new DatabaseError(
        "Failed to Fetch Financial Record Summary!",
        "Summary"
      );
    }
  }

  // * DONE
  async byId(id: string) {
    try {
      const record = await this.prisma.financialRecord.findUnique({
        where: { id },
      });
      if (!record) throw new NotFoundError("Could Not Find This Record!");
      return buildSuccessResponse(record, "Record Found Successfully!");
    } catch (error: unknown | NotFoundError | DatabaseError) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError(
        "Failed to Fetch Financial Record By ID!",
        "By ID"
      );
    }
  }

  // * DONE
  async update(id: string, data: UpdateFinancialRecord) {
    try {
      const record = await this.prisma.financialRecord.findUnique({
        where: { id },
      });
      if (!record) throw new NotFoundError("Could Not Find This Record!");

      const updatedRecord = await this.prisma.financialRecord.update({
        where: { id },
        data,
      });
      return buildSuccessResponse(
        updatedRecord,
        "Record Updated Successfully!",
        {
          before: record,
        }
      );
    } catch (error: unknown | NotFoundError | DatabaseError) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError("Failed to Update Financial Record!", "Update");
    }
  }

  // * DONE
  async delete(id: string) {
    try {
      const record = await this.prisma.financialRecord.findUnique({
        where: { id },
      });
      if (!record) throw new NotFoundError("Could Not Find This Record!");

      await this.prisma.financialRecord.update({
        where: { id },
        data: { isDeleted: true },
      });
      return buildSuccessResponse(
        null,
        `Record [ID: ${record.id}] Deleted Successfully!`,
        {
          deletedRecord: record,
        }
      );
    } catch (error: unknown | NotFoundError | DatabaseError) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError("Failed to Delete Financial Record!", "Delete");
    }
  }
}
