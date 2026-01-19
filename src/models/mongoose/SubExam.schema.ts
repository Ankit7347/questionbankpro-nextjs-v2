// src/models/mongoose/SubExam.schema.ts

import { Schema, model, models } from "mongoose";
import {
  BaseSchemaFields,
  BaseSchemaOptions,
} from "./base.schema";

const SubExamSchema = new Schema(
  {
    name: {
      en: { type: String, required: true, trim: true },
      hi: { type: String, trim: true },
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    examId: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
      index: true,
    },

    year: {
      type: Number,
      required: true,
      index: true,
    },

    stream: {
      type: String, // CS, IT, ME, EE
      required: true,
    },

    description: {
      en: { type: String },
      hi: { type: String },
    },

    icon: { type: String },

    order: {
      type: Number,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    isVisibleOnCard: {
      type: Boolean,
      default: false,
    },

    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);


export default models.SubExam || model("SubExam", SubExamSchema);
