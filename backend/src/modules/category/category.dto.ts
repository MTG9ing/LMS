import { z } from "zod";
import {
  CategoryQuerySchema,
  CategorySchema,
  CreateCategorySchema,
  UpdateCategorySchema,
} from "./category.validation";

export type Category = z.infer<typeof CategorySchema>;
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
export type CategoryQuery = z.infer<typeof CategoryQuerySchema>;
