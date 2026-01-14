// src/models/mongoose/Syllabus.schema.ts

import { Schema, model, models } from "mongoose";
import {
  BaseSchemaFields,
  BaseSchemaOptions,
} from "./base.schema";

const SyllabusSchema = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    validFrom: {
      type: Number, // e.g. 2025
      required: true,
    },

    validTo: {
      type: Number, // null = active
      default: null,
    },

    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

export default models.Syllabus || model("Syllabus", SyllabusSchema);
