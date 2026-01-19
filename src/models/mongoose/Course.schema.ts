// src/models/mongoose/Course.schema.ts

import { Schema, model, models, Types } from "mongoose";
import {
  BaseSchemaFields,
  BaseSchemaOptions,
} from "./base.schema";

const CourseSchema = new Schema(
  {
    subExamId: {
      type: Types.ObjectId,
      ref: "SubExam",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["FULL", "CRASH", "TEST_SERIES"],
      required: true,
      index: true,
    },

    name: {
      en: { type: String, required: true },
      hi: { type: String },
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    basePrice: {
      type: Number,
      required: true,
    },

    salePrice: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    validFrom: {
      type: Date,
      required: true,
    },

    validTo: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

CourseSchema.index(
  { subExamId: 1, type: 1 },
  { unique: true }
);

export default models.Course || model("Course", CourseSchema);
