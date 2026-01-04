// src/validation/quiz.schema.ts

import { z } from "zod";

export const createQuizSchema = z.object({
  title: z.string().min(2),
  quizType: z.enum([
    "topic",
    "chapter",
    "subject",
    "full_syllabus",
    "mock_test",
  ]),
  linkedEntityId: z.string(),
  totalQuestions: z.number().int().positive(),
  durationMinutes: z.number().int().positive(),
});

export const updateQuizSchema =
  createQuizSchema.partial();
