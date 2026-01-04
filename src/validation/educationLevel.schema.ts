// src/validation/educationLevel.schema.ts

import { z } from "zod";

export const createEducationLevelSchema = z.object({
  type: z.enum([
    "school",
    "graduation",
    "postgraduation",
    "competitive",
  ]),
  name: z.string().min(2),
  order: z.number().int().nonnegative(),
  isActive: z.boolean().optional(),
});

export const updateEducationLevelSchema =
  createEducationLevelSchema.partial();
