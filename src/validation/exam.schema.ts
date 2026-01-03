// src/validation/exam.schema.ts
import { z } from "zod";

export const createExamSchema = z.object({
  name: z.string().min(2),
  examType: z.enum(["board", "competitive", "university"]),
  conductedBy: z.string().optional(),
  isActive: z.boolean().optional(),
});
