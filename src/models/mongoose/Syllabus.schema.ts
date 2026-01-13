// src/models/mongoose/Syllabus.schema.ts

import { Schema, model, models, Types } from "mongoose";
import { BaseSchemaFields, BaseSchemaOptions } from "./base.schema";

const SyllabusSchema = new Schema(
  {
    ...BaseSchemaFields,

    examId: {
      type: Types.ObjectId,
      ref: "Exam",
      required: true,
      index: true,
    },

    courseId: {
      type: Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    year: {
      type: Number,
      required: true,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  BaseSchemaOptions
);

/**
 * One syllabus per exam + course + year
 */
SyllabusSchema.index(
  { examId: 1, courseId: 1, year: 1 },
  { unique: true }
);

export default models.Syllabus || model("Syllabus", SyllabusSchema);
