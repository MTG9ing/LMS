import { z } from "zod";
import { PaymentPlanSchema } from "../paymentPlan/paymentPlan.validation";
import { FinancialRecordSchema } from "../financialRecord/financialRecord.validation";
import { PaymentSchema } from "../payment/payment.validation";

const BaseCategorySchema = z.object({
  name: z.string().min(3).max(50).nonempty(),
  description: z.string().min(5).max(255).optional().nullable(),
  isActive: z.boolean().optional().default(true),
});

export const CreateCategorySchema = BaseCategorySchema;

export const UpdateCategorySchema = BaseCategorySchema.partial();

export const CategorySchema = BaseCategorySchema.extend({
  id: z.string().uuid("Invalid UUID"),
  createdAt: z.date(),
  updatedAt: z.date(),
  payments: z.array(z.lazy(() => PaymentSchema)).default([]),
  FinancialRecord: z.array(z.lazy(() => FinancialRecordSchema)).default([]),
  PaymentPlan: z.array(z.lazy(() => PaymentPlanSchema)).default([]),
});

export const CategoryQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform(Number)
    .refine((val) => !val || val > 0, {
      message: "Page must be a positive number.",
    }),
  limit: z
    .string()
    .optional()
    .transform(Number)
    .refine((val) => !val || val > 0, {
      message: "Limit must be a positive number.",
    }),
  orderBy: z.enum(["name", "createdAt", "updatedAt"]).optional(),
  sort: z.enum(["asc", "desc"]).optional(),
  name: z.string().optional(),
});
