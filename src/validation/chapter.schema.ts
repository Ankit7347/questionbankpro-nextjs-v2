// src/validation/chapter.schema.ts

import { z } from "zod";

export const createChapterSchema = z.object({
  subjectId: z.string(),
  chapterNumber: z.number().int().positive(),
  name: z.string().min(2),
  order: z.number().int().nonnegative(),
  isActive: z.boolean().optional(),
});

export const updateChapterSchema =
  createChapterSchema.partial();
