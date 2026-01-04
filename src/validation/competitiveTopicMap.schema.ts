// src/validation/competitiveTopicMap.schema.ts

import { z } from "zod";

export const createCompetitiveTopicMapSchema =
  z.object({
    examId: z.string(),
    topicId: z.string(),
    weightage: z.number().optional(),
    priority: z.enum([
      "low",
      "medium",
      "high",
    ]).optional(),
  });

export const updateCompetitiveTopicMapSchema =
  createCompetitiveTopicMapSchema.partial();
