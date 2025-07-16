import { z } from "zod";
import {
  CreateHomeworkSchema,
  CreateHomeworkTemplateSchema,
  HomeworkSchema,
  HomeworkTemplateSchema,
  UpdateHomeworkSchema,
  UpdateHomeworkTemplateSchema,
} from "./homework.validation";

export type Homework = z.infer<typeof HomeworkSchema>;
export type HomewrokTemplate = z.infer<typeof HomeworkTemplateSchema>;

export type CreateHomeworkInput = z.infer<typeof CreateHomeworkSchema>;
export type CreateHomeworkTemplateInput = z.infer<
  typeof CreateHomeworkTemplateSchema
>;

export type UpdateHomeworkInput = z.infer<typeof UpdateHomeworkSchema>;
export type UpdateHomeworkTemplateInput = z.infer<
  typeof UpdateHomeworkTemplateSchema
>;
