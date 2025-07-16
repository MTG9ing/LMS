import { z } from "zod";

const BaseExamSchema = z.object({
  title: z.string().nonempty().min(3).max(50),
  startsAt: z.date().default(() => new Date()),
  endsAt: z.date(),
  fullGrade: z.number().positive().default(10),
  gradeLevelId: z.string().uuid(),
});

export const CreateExamSchema = BaseExamSchema;
export const UpdateExamSchema = BaseExamSchema.partial();

export const ExamSchema = BaseExamSchema.extend({
  id: z.string().uuid(),
});
