// src/validation/subject.schema.ts

import { z } from "zod";

export const createSubjectSchema = z.object({
  syllabusId: z.string(),
  name: z.string().min(2),
  code: z.string().optional(),
  order: z.number().int().nonnegative(),
  isActive: z.boolean().optional(),
});

export const updateSubjectSchema =
  createSubjectSchema.partial();
