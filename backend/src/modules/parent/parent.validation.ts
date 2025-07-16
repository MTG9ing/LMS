import { z } from "zod";
import { StudentSchema } from "../student/student.validations";

const phoneRegex = /^(?:\+2)?(010|011|012|015)\d{8}$/;

const BaseParentSchema = z.object({
  name: z.string().min(3).max(30),
  primaryPhone: z
    .string()
    .regex(phoneRegex, "Primary phone must be a valid Egyptian phone number"),
  secondaryPhone: z
    .string()
    .regex(phoneRegex, "Secondary phone must be a valid Egyptian phone number")
    .optional(),
  address: z.string().optional(),
});

export const CreateParentSchema = BaseParentSchema;
export const UpdateParentSchema = BaseParentSchema.partial();

export const ParentSchema = BaseParentSchema.extend({
  id: z.string().uuid(),
  students: z.array(z.lazy(() => StudentSchema)),
});
