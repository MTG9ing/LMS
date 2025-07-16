import { z } from "zod";
import {
  CreateFinancialRecordSchema,
  FinancialRecordQuerySchema,
  FinancialRecordSchema,
  UpdateFinancialRecordSchema,
} from "./financialRecord.validation";

export type FinancialRecord = z.infer<typeof FinancialRecordSchema>;
export type CreateFinancialRecord = z.infer<typeof CreateFinancialRecordSchema>;
export type UpdateFinancialRecord = z.infer<typeof UpdateFinancialRecordSchema>;
export type FinancialRecordQuery = z.infer<typeof FinancialRecordQuerySchema>;
