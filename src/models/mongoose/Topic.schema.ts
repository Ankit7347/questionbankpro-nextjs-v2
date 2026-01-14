// src/models/mongoose/Topic.schema.ts

import { Schema, model, models } from "mongoose";
import {
  BaseSchemaFields,
  BaseSchemaOptions,
} from "./base.schema";

const TopicSchema = new Schema(
  {
    chapterId: {
      type: Schema.Types.ObjectId,
      ref: "Chapter",
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

    /** NEW FIELDS **/
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
      index: true,
    },

    isCoreTopic: {
      type: Boolean,
      default: false,
      index: true,
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

export default models.Topic || model("Topic", TopicSchema);
