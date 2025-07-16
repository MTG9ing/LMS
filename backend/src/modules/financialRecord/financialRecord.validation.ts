import { z } from "zod";

const TransactionType = z.enum(["INCOME", "EXPENSE"], {
  errorMap: () => ({ message: "Type must be either INCOME or EXPENSE" }),
});

const BaseFinancialRecordSchema = z.object({
  amount: z.number().positive("Amount must be a positive number"),
  type: TransactionType.optional(),
  categoryId: z.string().uuid("Invalid Category UUID"),
  description: z.string().nullable().optional(),
  date: z
    .date()
    .optional()
    .default(() => new Date()),
  taxAmount: z.number().nullable().optional(),
  paymentId: z.string().uuid("Invalid Payment UUID"),
});

export const FinancialRecordQuerySchema = z
  .object({
    type: TransactionType.optional(),
    categoryId: z.string().uuid("Invalid category ID"),
    paymentId: z.string().uuid("Invalid payment ID"),
    from: z.string().refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid Date 'From' Format",
    }),
    to: z.string().refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid Date 'To' Format",
    }),
    sort: z.enum(["date", "amount"]),
    order: z.enum(["asc", "desc"]),
    page: z.string().transform((val) => (val ? parseInt(val) : 1)),
    limit: z.string().transform((val) => (val ? parseInt(val) : 10)),
  })
  .partial();

export const CreateFinancialRecordSchema = BaseFinancialRecordSchema;

export const UpdateFinancialRecordSchema = BaseFinancialRecordSchema.extend({
  isDeleted: z.boolean().optional(),
}).partial();

export const FinancialRecordSchema = BaseFinancialRecordSchema.extend({
  id: z.string().uuid("Invalid Financial Record ID"),
});
