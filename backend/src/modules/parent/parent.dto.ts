import { z } from "zod";
import {
  CreateParentSchema,
  ParentSchema,
  UpdateParentSchema,
} from "./parent.validation";

export type Parent = z.infer<typeof ParentSchema>;
export type CreateParent = z.infer<typeof CreateParentSchema>;
export type UpdateParent = z.infer<typeof UpdateParentSchema>;
