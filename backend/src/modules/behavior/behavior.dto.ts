import { z } from "zod";
import {
  BehaivorSchema,
  CreateBehaviorSchema,
  UpdateBehaviorSchema,
} from "./behavior.validation";

export type Behavior = z.infer<typeof BehaivorSchema>;
export type CreateBehaviorInput = z.infer<typeof CreateBehaviorSchema>;
export type UpdateBehaviorInput = z.infer<typeof UpdateBehaviorSchema>;
