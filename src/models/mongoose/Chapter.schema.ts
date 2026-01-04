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

    chapterNumber: {
      type: Number,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    order: {
      type: Number,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

export const ChapterModel =
  models.Chapter || model("Chapter", ChapterSchema);
