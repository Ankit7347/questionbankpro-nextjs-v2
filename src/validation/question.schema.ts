// src/validation/question.schema.ts

import { z } from "zod";

export const createQuestionSchema = z.object({
  topicId: z.string(),
  type: z.enum([
    "mcq",
    "numerical",
    "true_false",
  ]),
  questionText: z.string().min(5),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string(),
  difficulty: z.enum([
    "easy",
    "medium",
    "hard",
  ]),
  isPreviousYear: z.boolean().optional(),
});

export const updateQuestionSchema =
  createQuestionSchema.partial();
