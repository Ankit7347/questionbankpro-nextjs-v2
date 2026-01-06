// src/models/mongoose/Exam.schema.ts
import { Schema, model, models } from "mongoose";
import {
  BaseSchemaFields,
  BaseSchemaOptions,
} from "./base.schema";

const ExamSchema = new Schema(
  {
    name: {
      en: { type: String, required: true, trim: true },
      hi: { type: String, trim: true },
    },

    shortName: {
      en: { type: String, trim: true },
      hi: { type: String, trim: true },
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    educationLevelId: {
      type: Schema.Types.ObjectId,
      ref: "EducationLevel",
      required: true,
      index: true,
    },

    description: {
      en: { type: String },
      hi: { type: String },
    },

    icon: { type: String },
    bannerImage: { type: String },

    order: {
      type: Number,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

ExamSchema.index(
  { educationLevelId: 1, slug: 1 },
  { unique: true }
);

export default models.Exam || model("Exam", ExamSchema);
