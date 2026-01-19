// src/models/mongoose/OfficialSyllabus.schema.ts

import { Schema, model, models, Types } from "mongoose";
import {
  BaseSchemaFields,
  BaseSchemaOptions,
} from "./base.schema";

const OfficialSyllabusSchema = new Schema(
  {
    subExamId: {
      type: Types.ObjectId,
      ref: "SubExam",
      required: true,
      index: true,
    },

    year: {
      type: Number,
      required: true,
      index: true,
    },

    version: {
      type: Number,
      default: 1,
    },

    validFrom: {
      type: Number,
      required: true,
    },

    validTo: {
      type: Number,
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

OfficialSyllabusSchema.index(
  { subExamId: 1, version: 1 },
  { unique: true }
);

export default models.OfficialSyllabus ||
  model("OfficialSyllabus", OfficialSyllabusSchema);
