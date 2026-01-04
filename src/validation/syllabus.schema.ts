// src/validation/syllabus.schema.ts

import { z } from "zod";

export const createSyllabusSchema = z.object({
  examId: z.string(),
  courseId: z.string(),
  academicYear: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const updateSyllabusSchema =
  createSyllabusSchema.partial();
