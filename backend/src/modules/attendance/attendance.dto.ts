import { z } from "zod";
import {
  AttendanceSchema,
  CreateAttendanceSchema,
  UpdateAttendanceSchema,
} from "./attendance.validation";

export type Attendance = z.infer<typeof AttendanceSchema>;
export type CreateAttendanceInput = z.infer<typeof CreateAttendanceSchema>;
export type UpdateAttendanceInput = z.infer<typeof UpdateAttendanceSchema>;
