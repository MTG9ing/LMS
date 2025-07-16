import { z } from "zod";
import { PaymentSchema } from "../payment/payment.validation";
import { AttendanceSchema } from "../attendance/attendance.validation";
import { AchievementSchema } from "../achievement/achievement.validation";
import { BehaivorSchema } from "../behavior/behavior.validation";
import { HomeworkSchema } from "../homework/homework.validation";
import { ExamSchema } from "../exam/exam.validation";

const BaseStudentSchema = z.object({
  fullName: z.string().min(3).max(50),
  dateOfBirth: z.date(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  gradeLevelId: z.string().uuid(),
  parentId: z.string({ message: "a Parent ID Must Be Provided" }).uuid(),
  isOnline: z.boolean().optional(),
  isStillAttending: z.boolean().optional(),
  notes: z.array(z.string()).optional().default([]),
  sensitiveNotes: z.string().nullable().optional(),
  paymentPlanId: z.string(),
});

export const StudentCreateSchema = BaseStudentSchema.extend({
  studentNumber: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[A-Za-z0-9-]+$/, "Must be uppercase alphanumeric with hyphens"),
});

export const StudentUpdateSchema = BaseStudentSchema.partial();

export const StudentSchema = BaseStudentSchema.extend({
  id: z.string().uuid("Invalid Student ID"),
  createdAt: z.date(),
  isArchived: z.boolean().optional(),
  studentNumber: z.string(),
  archivedAt: z.date().optional(),
  exams: z.array(z.lazy(() => ExamSchema)),
  homework: z.array(z.lazy(() => HomeworkSchema)),
  behaviors: z.array(z.lazy(() => BehaivorSchema)),
  achievements: z.array(z.lazy(() => AchievementSchema)),
  Attendance: z.array(z.lazy(() => AttendanceSchema)),
  payments: z.array(z.lazy(() => PaymentSchema)),
});

// TODO(validation): create query
