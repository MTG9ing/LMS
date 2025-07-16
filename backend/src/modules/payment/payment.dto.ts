import { z } from "zod";
import {
  CreatePaymentSchema,
  PaymentSchema,
  UpdatePaymentSchema,
} from "./payment.validation";

export type Payment = z.infer<typeof PaymentSchema>;
export type CreatePayment = z.infer<typeof CreatePaymentSchema>;
export type UpdatePayment = z.infer<typeof UpdatePaymentSchema>;
