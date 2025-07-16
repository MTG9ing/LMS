import { z } from "zod";
import {
  CreatePaymentPlanSchema,
  paymentFrequencyEnum,
  PaymentPlanQuerySchema,
  PaymentPlanSchema,
  UpdatePaymentPlanSchema,
} from "./paymentPlan.validation";

export type TPaymentPlan = z.infer<typeof PaymentPlanSchema>;
export type CreatePaymentPlanInput = z.infer<typeof CreatePaymentPlanSchema>;
export type UpdatePaymentPlanInput = z.infer<typeof UpdatePaymentPlanSchema>;
export type PaymentPlanQuery = z.infer<typeof PaymentPlanQuerySchema>;
export type paymentFrequency = z.infer<typeof paymentFrequencyEnum>;
