// src/models/mongoose/Chapter.schema.ts

import { Schema, model, models } from "mongoose";
import {
  BaseSchemaFields,
  BaseSchemaOptions,
} from "./base.schema";

const ChapterSchema = new Schema(
  {
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    validFrom: {
      type: Number,
      required: true,
    },

    validTo: {
      type: Number,
      default: null,
    },

    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

export default models.Chapter || model("Chapter", ChapterSchema);
