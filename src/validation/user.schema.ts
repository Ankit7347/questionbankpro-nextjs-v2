// validation/user.schema.ts
import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  password: z.string().min(8),
  role: z.enum(["student", "superadmin", "contentadmin"]).optional(),
});
