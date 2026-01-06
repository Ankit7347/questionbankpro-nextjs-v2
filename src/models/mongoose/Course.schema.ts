// src/models/mongoose/Course.schema.ts
import { Schema, model, models } from "mongoose";
import {
  BaseSchemaFields,
  BaseSchemaOptions,
} from "./base.schema";

const CourseSchema = new Schema(
  {
    name: {
      en: { type: String, required: true, trim: true },
      hi: { type: String, trim: true },
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    examId: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
      index: true,
    },

    description: {
      en: { type: String },
      hi: { type: String },
    },

    durationYears: { type: Number },
    totalSemesters: { type: Number },
    classRange: { type: String },
    stream: { type: String },

    icon: { type: String },

    badge: {
      en: { type: String },
      hi: { type: String },
    },

    order: {
      type: Number,
      required: true,
    },

    isVisibleOnCard: {
      type: Boolean,
      default: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

CourseSchema.index(
  { examId: 1, slug: 1 },
  { unique: true }
);

export default models.Course || model("Course", CourseSchema);
