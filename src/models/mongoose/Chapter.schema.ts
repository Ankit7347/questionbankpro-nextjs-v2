// src/models/mongoose/Chapter.schema.ts

import { Schema, model, models } from "mongoose";
import {
  BaseSchemaFields,
  BaseSchemaOptions,
} from "./base.schema";

const ChapterSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    description: {
      type: String,
      default: "",
    },

    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

export default models.Chapter || model("Chapter", ChapterSchema);
