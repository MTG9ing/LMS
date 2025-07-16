import { z } from "zod";
import {
  AchievementSchema,
  CreateAchievementSchema,
  UpdateAchievementSchema,
} from "./achievement.validation";

export type Achievement = z.infer<typeof AchievementSchema>;
export type CreateAchievementInput = z.infer<typeof CreateAchievementSchema>;
export type UpdateAchievementInput = z.infer<typeof UpdateAchievementSchema>;
