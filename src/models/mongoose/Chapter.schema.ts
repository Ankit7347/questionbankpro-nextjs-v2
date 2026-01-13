// src/models/mongoose/Chapter.schema.ts

import { Schema, model, models, Types } from "mongoose";
import { BaseSchemaFields, BaseSchemaOptions } from "./base.schema";

const ChapterSchema = new Schema(
  {
    ...BaseSchemaFields,

    syllabusId: {
      type: Types.ObjectId,
      ref: "Syllabus",
      required: true,
      index: true,
    },

    subjectId: {
      type: Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },

    slug: {
      type: String,
      required: true,
    },

    name: {
      en: { type: String, required: true },
      hi: { type: String },
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  BaseSchemaOptions
);

ChapterSchema.index(
  { syllabusId: 1, subjectId: 1, slug: 1 },
  { unique: true }
);

export default models.Chapter || model("Chapter", ChapterSchema);
