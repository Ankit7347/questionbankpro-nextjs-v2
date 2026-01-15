// src/models/mongoose/TopicMap.schema.ts

import { Schema, model, models, Types } from "mongoose";
import {
  BaseSchemaFields,
  BaseSchemaOptions,
} from "./base.schema";

const TopicMapSchema = new Schema(
  {
    chapterMapId: {
      type: Types.ObjectId,
      ref: "ChapterMap",
      required: true,
      index: true,
    },

    topicId: {
      type: Types.ObjectId,
      ref: "Topic",
      required: true,
    },

    order: {
      type: Number,
      required: true,
    },

    isOptional: {
      type: Boolean,
      default: false,
    },

    isRemoved: {
      type: Boolean,
      default: false,
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

export default models.TopicMap || model("TopicMap", TopicMapSchema);
