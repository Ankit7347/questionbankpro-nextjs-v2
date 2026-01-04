// src/validation/bestBook.schema.ts

import { z } from "zod";

export const createBestBookSchema = z.object({
  title: z.string(),
  author: z.string(),
  subject: z.string(),
  className: z.string(),
  board: z.string(),
  competitive: z.boolean().optional(),
  imageUrl: z.string().url().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const updateBestBookSchema =
  createBestBookSchema.partial();
