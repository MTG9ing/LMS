import { z } from "zod";
import { FinancialRecordSchema } from "../financialRecord/financialRecord.validation";

const PaymentMethodEnum = z.enum(
  ["CASH", "BANK_TRANSFER", "CHEQUE", "CREDIT_CARD", "E_WALLET", "OTHER"],
  {
    errorMap: () => ({ message: "Invalid payment method" }),
  }
);

const TransactionTypeEnum = z.enum(["INCOME", "EXPENSE"], {
  errorMap: () => ({ message: "Invalid transaction type" }),
});

const BasePaymentSchema = z.object({
  amount: z.number().positive("Amount must be a positive number").default(9),
  type: TransactionTypeEnum.optional(),
  paymentMethod: PaymentMethodEnum.optional(),
  paymentDate: z.date().optional(),
  description: z.string().nullable().optional(),
  studentId: z.string().uuid("Invalid Student UUID").optional(),
  planId: z.string().uuid("Invalid Payment Plan UUID").optional(),
  categoryId: z.string().uuid("Invalid Category UUID").optional(),
});

export const CreatePaymentSchema = BasePaymentSchema;
export const UpdatePaymentSchema = BasePaymentSchema.partial().extend({
  isDeleted: z.boolean().default(false).optional(),
});

export const PaymentSchema = BasePaymentSchema.extend({
  id: z.string().uuid("Invalid payment ID"),
  records: z.array(FinancialRecordSchema),
  isDeleted: z.boolean().default(false).optional(),
});
