import { z } from "zod";
import {
  StudentCreateSchema,
  StudentSchema,
  StudentUpdateSchema,
} from "./student.validations";

export type Student = z.infer<typeof StudentSchema>;
export type StudentCreate = z.infer<typeof StudentCreateSchema>;
export type StudentUpdate = z.infer<typeof StudentUpdateSchema>;
