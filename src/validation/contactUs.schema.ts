// validation/contactUs.schema.ts
import { z } from "zod";

export const createContactUsSchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string().email(),
  text: z.string(),
});
