import { z } from "zod";
import { StudentSchema } from "../student/student.validations";
import { AttendanceSchema } from "../attendance/attendance.validation";
import { ExamSchema } from "../exam/exam.validation";
import { HomeworkTemplateSchema } from "../homework/homework.validation";

const BaseGradeLevelSchema = z.object({
  name: z.string().nonempty("Name is required"),
  order: z.number().positive("Order Must Be Positive"),
});

export const CreateGradeLevelSchema = BaseGradeLevelSchema;
export const UpdateGradeLevelSchema = BaseGradeLevelSchema.extend({
  isActive: z.boolean(),
}).partial();

export const GradeLevelSchema = BaseGradeLevelSchema.extend({
  id: z.string().uuid("Invalid Grade Level UUID"),
  isActive: z.boolean().optional(),
  students: z.array(z.lazy(() => StudentSchema)),
  Attendance: z.array(z.lazy(() => AttendanceSchema)),
  exams: z.array(z.lazy(() => ExamSchema)),
  homeworkTemplates: z.array(z.lazy(() => HomeworkTemplateSchema)),
});
