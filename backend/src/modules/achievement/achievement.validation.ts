import { z } from "zod";

const BaseAchievementSchema = z.object({
  title: z.string().nonempty().min(3).max(100),
  awardedAt: z
    .date()
    .optional()
    .refine((date) => !date || date <= new Date(), {
      message: "Award date cannot be in the future.",
    }),
  description: z.string().optional(),
  studentId: z.string().uuid(),
});

export const CreateAchievementSchema = BaseAchievementSchema;
export const UpdateAchievementSchema = BaseAchievementSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be updated." }
);

export const AchievementSchema = BaseAchievementSchema.extend({
  id: z.string().uuid(),
});
