// src/validation/contactUs.schema.ts

import { z } from "zod";

export const createContactUsSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(5),
});
