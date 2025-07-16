import { z } from "zod";

const BaseAttendanceSchema = z.object({
  studentId: z.string().uuid("Invalid Student UUID"),
  date: z.date().refine((d) => d <= new Date(), {
    message: "Attendance date cannot be in the future.",
  }),
  gradeLevelId: z.string().uuid("Invalid Grade Level UUID"),
});

export const CreateAttendanceSchema = BaseAttendanceSchema;
export const UpdateAttendanceSchema = BaseAttendanceSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be updated." }
);

export const AttendanceSchema = BaseAttendanceSchema.extend({
  id: z.string().cuid("Invalid Attendnace CUID"),
});
