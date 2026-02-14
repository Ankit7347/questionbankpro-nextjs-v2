// src/validation/user.schema.ts

import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8),
  role: z.enum([
    "student",
    "contentadmin",
    "superadmin",
  ]).optional(),
  className: z.string().optional(),
  competition: z.string().optional(),
  stateId: z.string().optional(),
  districtId: z.string().optional(),
  preferences: z.object({
    theme: z.enum(["light","dark","system"]).optional(),
  }).optional(),
});

export const updateUserSchema =
  createUserSchema.partial().omit({
    password: true,
  });

export const updatePreferencesSchema = z.object({
  theme: z.enum(["light","dark","system"]),
});
