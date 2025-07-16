import { z } from "zod";
import {
  CreateExamSchema,
  ExamSchema,
  UpdateExamSchema,
} from "./exam.validation";

export type Exam = z.infer<typeof ExamSchema>;
export type CreateExamInput = z.infer<typeof CreateExamSchema>;
export type UpdateExamInput = z.infer<typeof UpdateExamSchema>;
