// src/models/mongoose/Topic.schema.ts

import { Schema, model, models } from "mongoose";
import {
  BaseSchemaFields,
  BaseSchemaOptions,
} from "./base.schema";

const TopicSchema = new Schema(
  {
    name: {
      en: { type: String, required: true, trim: true },
      hi: { type: String, trim: true },
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

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },

    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

export default models.Topic || model("Topic", TopicSchema);
