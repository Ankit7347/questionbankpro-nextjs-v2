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
      min: 0,
    },

    salePrice: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: function (this: any, v: number) {
          return v <= this.basePrice;
        },
        message: "salePrice cannot exceed basePrice",
      },
    },

    validFrom: {
      type: Date,
    },

    validTo: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    visibility: {
      type: String,
      enum: ["PUBLIC", "PRIVATE"],
      default: "PUBLIC",
      index: true,
    },

    description: {
      en: { type: String },
      hi: { type: String },
    },
  },
  {
    ...BaseSchemaOptions,
  }
);

/**
 * UNIQUE: One course slug per SubExam
 * Allows:
 *  - Multiple FULL / CRASH / TEST_SERIES
 *  - Multiple language batches
 */
CourseSchema.index(
  { subExamId: 1, slug: 1 },
  { unique: true }
);

export default models.Course || model("Course", CourseSchema);
