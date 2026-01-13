// src/models/mongoose/Topic.schema.ts

import { Schema, model, models, Types } from "mongoose";
import { BaseSchemaFields, BaseSchemaOptions } from "./base.schema";

const TopicSchema = new Schema(
  {
    ...BaseSchemaFields,

    syllabusId: {
      type: Types.ObjectId,
      ref: "Syllabus",
      required: true,
      index: true,
    },

    chapterId: {
      type: Types.ObjectId,
      ref: "Chapter",
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

TopicSchema.index(
  { syllabusId: 1, chapterId: 1, slug: 1 },
  { unique: true }
);

export default models.Topic || model("Topic", TopicSchema);
