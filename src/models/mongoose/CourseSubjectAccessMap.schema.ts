// src/models/mongoose/CourseSubjectAccessMap.schema.ts

import { Schema, model, models, Types } from "mongoose";
import {
  BaseSchemaFields,
  BaseSchemaOptions,
} from "./base.schema";

const CourseSubjectAccessMapSchema = new Schema(
  {
    courseId: {
      type: Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    subjectId: {
      type: Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },

    isIncluded: {
      type: Boolean,
      default: true,
    },

    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

CourseSubjectAccessMapSchema.index(
  { courseId: 1, subjectId: 1 },
  { unique: true }
);

export default models.CourseSubjectAccessMap ||
  model("CourseSubjectAccessMap", CourseSubjectAccessMapSchema);
