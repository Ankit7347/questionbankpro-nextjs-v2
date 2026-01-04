// src/validation/geolocation.schema.ts

import { z } from "zod";

export const createStateSchema = z.object({
  name: z.string().min(2),
  code: z.string().optional(),
});

export const createDistrictSchema = z.object({
  name: z.string().min(2),
  stateId: z.string(),
});
