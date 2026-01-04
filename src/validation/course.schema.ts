// src/validation/course.schema.ts

import { z } from "zod";

export const createCourseSchema = z.object({
  educationLevelId: z.string(),
  name: z.string().min(2),
  stream: z.string().optional(),
  durationYears: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
});

export const updateCourseSchema =
  createCourseSchema.partial();
