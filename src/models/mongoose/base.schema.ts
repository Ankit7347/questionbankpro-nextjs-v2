// src/models/mongoose/base.schema.ts
import { Schema } from "mongoose";

export const BaseSchemaFields = {
  isDeleted: {
    type: Boolean,
    default: false,
    index: true,
  },
  updatedBy: {
    type: String, // UUID
  },
};

export const BaseSchemaOptions = {
  timestamps: true, // createdAt, updatedAt
};
