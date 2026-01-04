// src/validation/base.schema.ts

import { z } from "zod";

export const baseResponseSchema = {
  id: z.string(),
  isDeleted: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  updatedBy: z.string().optional(),
};
