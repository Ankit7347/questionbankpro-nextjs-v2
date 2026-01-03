// Course.schema.ts
import { Schema, model, models } from "mongoose";
import { BaseSchemaFields, BaseSchemaOptions } from "./base.schema";

const CourseSchema = new Schema(
  {
    educationLevelId: {
      type: Schema.Types.ObjectId,
      ref: "EducationLevel",
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    stream: { type: String },
    durationYears: { type: Number },
    isActive: { type: Boolean, default: true },
    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

export const CourseModel =
  models.Course || model("Course", CourseSchema);
