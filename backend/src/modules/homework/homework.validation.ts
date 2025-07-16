import { z } from "zod";

// Homework Schema
const BaseHomeworkSchema = z.object({
  studentGrade: z.number().positive().default(0),
  submittedAt: z.date().default(new Date(Date.now())),
  studentId: z.string().uuid(),
  templateId: z.string().uuid(),
});

export const CreateHomeworkSchema = BaseHomeworkSchema;
export const UpdateHomeworkSchema = BaseHomeworkSchema.extend({
  isDone: z.boolean().optional(),
  isLate: z.boolean().optional(),
}).partial();

export const HomeworkSchema = BaseHomeworkSchema.extend({
  isDone: z.boolean(),
  isLate: z.boolean(),
});

// Homework Template Schema
const BaseHomeworkTemplateSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().nullable().optional(),
  dueDate: z.date(),
  gradeLevelId: z.string().uuid(),
});

export const CreateHomeworkTemplateSchema = BaseHomeworkTemplateSchema;
export const UpdateHomeworkTemplateSchema =
  BaseHomeworkTemplateSchema.partial();

export const HomeworkTemplateSchema = BaseHomeworkTemplateSchema.extend({
  assignments: z.array(z.lazy(() => HomeworkSchema)),
});
