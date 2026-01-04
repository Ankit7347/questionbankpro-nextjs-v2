// src/validation/topic.schema.ts

import { z } from "zod";

export const createTopicSchema = z.object({
  chapterId: z.string(),
  name: z.string().min(2),
  difficulty: z.enum([
    "easy",
    "medium",
    "hard",
  ]).optional(),
  isCoreTopic: z.boolean().optional(),
});

export const updateTopicSchema =
  createTopicSchema.partial();
