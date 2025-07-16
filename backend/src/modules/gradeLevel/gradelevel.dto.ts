import { z } from "zod";
import {
  CreateGradeLevelSchema,
  GradeLevelSchema,
  UpdateGradeLevelSchema,
} from "./gradelevel.validation";

export type GradeLevel = z.infer<typeof GradeLevelSchema>;
export type CreateGradeLevelInput = z.infer<typeof CreateGradeLevelSchema>;
export type UpdateGradeLevelInput = z.infer<typeof UpdateGradeLevelSchema>;
