import { z } from "zod";

const BaseBehaviorSchema = z.object({
  type: z.string().nonempty(),
  score: z.number().min(0).max(5).optional(),
  notes: z.string().optional().nullable(),
  studentId: z.string().uuid(),
});

export const CreateBehaviorSchema = BaseBehaviorSchema;
export const UpdateBehaviorSchema = BaseBehaviorSchema.partial();

export const BehaivorSchema = BaseBehaviorSchema.extend({
  id: z.string().uuid(),
  createdAt: z.date(),
});
