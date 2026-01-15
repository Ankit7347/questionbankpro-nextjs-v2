// src/models/mongoose/ChapterMap.schema.ts
import { Schema, model, models, Types } from "mongoose";
import {
  BaseSchemaFields,
  BaseSchemaOptions,
} from "./base.schema";

const ChapterMapSchema = new Schema(
  {
    subjectMapId: {
      type: Types.ObjectId,
      ref: "SubjectMap",
      required: true,
      index: true,
    },

    chapterId: {
      type: Types.ObjectId,
      ref: "Chapter",
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

export default models.ChapterMap || model("ChapterMap", ChapterMapSchema);
