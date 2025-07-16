import { z, ZodType } from "zod";
import { StudentSchema } from "../student/student.validations";
import { PaymentPlan } from "../../generated/prisma";
import { PaymentSchema } from "../payment/payment.validation";

export const paymentFrequencyEnum = z.enum(
  ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"],
  {
    errorMap: () => ({ message: "Invalid Payment Frequency Type" }),
  }
);

export const BasePaymentPlanSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long!" })
    .max(50, { message: "Long names are not allowed!" }),
  type: paymentFrequencyEnum.optional(),
  amount: z
    .number()
    .gte(0, { message: "Amount must be greater than or equal to 0" })
    .default(0),
  isActive: z.boolean().optional(),
  isRecurring: z.boolean().optional(),
  categoryId: z.string().uuid({ message: "Invalid category ID" }),
});

export const PaymentPlanSchema: ZodType<Partial<PaymentPlan>> =
  BasePaymentPlanSchema.extend({
    id: z.string().uuid(),
    students: z.array(z.lazy(() => StudentSchema)).optional(),
    payments: z.array(z.lazy(() => PaymentSchema)).optional(),
  });

export const CreatePaymentPlanSchema = BasePaymentPlanSchema;

export const UpdatePaymentPlanSchema = BasePaymentPlanSchema.partial();

// TODO(): optimize query schema structure
export const PaymentPlanQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  orderBy: z.enum(["name", "amount", "type"]).optional(),
  sort: z.enum(["asc", "desc"]).optional(),
  name: z.string().optional(),
  type: paymentFrequencyEnum.optional(),
  isActive: z.union([z.literal("true"), z.literal("false")]).optional(),
  isRecurring: z.union([z.literal("true"), z.literal("false")]).optional(),
  categoryId: z.string().uuid().optional(),
  amountMin: z.string().optional(),
  amountMax: z.string().optional(),
});
