// Syllabus.schema.ts
import { Schema, model, models } from "mongoose";
import { BaseSchemaFields, BaseSchemaOptions } from "./base.schema";

const SyllabusSchema = new Schema(
  {
    examId: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
      index: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    academicYear: { type: String },
    isActive: { type: Boolean, default: true },
    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

export const SyllabusModel =
  models.Syllabus || model("Syllabus", SyllabusSchema);
