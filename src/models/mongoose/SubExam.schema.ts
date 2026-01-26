// src/models/mongoose/SubExam.schema.ts

import { Schema, model, models } from "mongoose";
import {
  BaseSchemaFields,
  BaseSchemaOptions,
} from "./base.schema";

const SubExamSchema = new Schema(
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

    /**
     * SubExam behavior type
     * - school      → class based (CBSE Class 6)
     * - competitive → year + stream based (GATE 2026 CS)
     * - program     → degree / course based (B.Tech CS, MBA Finance)
     */
    type: {
      type: String,
      enum: ["school", "competitive", "program"],
      required: true,
      index: true,
    },

    /**
     * SCHOOL ONLY
     */
    class: {
      type: Number, // 6–12
      index: true,
    },

    /**
     * COMPETITIVE ONLY
     */
    year: {
      type: Number,
      index: true,
    },

    /**
     * COMPETITIVE + PROGRAM
     */
    stream: {
      type: String, // CS, IT, ME, Engineering, Medical, Commerce, etc.
      index: true,
    },

    description: {
      en: { type: String },
      hi: { type: String },
    },

    icon: { type: String },

    order: {
      type: Number,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isVisibleOnCard: {
      type: Boolean,
      default: false,
    },

    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

/* ------------------------------------------------------------------ */
/* INDEXES (CRITICAL – DO NOT REMOVE)                                  */
/* ------------------------------------------------------------------ */

// SCHOOL → one class per exam
SubExamSchema.index(
  { examId: 1, class: 1 },
  {
    unique: true,
    partialFilterExpression: { type: "school" },
  }
);

// COMPETITIVE → one (year + stream) per exam
SubExamSchema.index(
  { examId: 1, year: 1, stream: 1 },
  {
    unique: true,
    partialFilterExpression: { type: "competitive" },
  }
);

// PROGRAM → slug unique within exam
SubExamSchema.index(
  { examId: 1, slug: 1 },
  {
    unique: true,
    partialFilterExpression: { type: "program" },
  }
);

// GLOBAL safety (routing guarantee)
SubExamSchema.index({ slug: 1 }, { unique: true });

export default models.SubExam || model("SubExam", SubExamSchema);
