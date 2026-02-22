// src/models/mongoose/BestBook.schema.ts

import { Schema, model, models, Types } from "mongoose";
import {
  BaseSchemaFields,
  BaseSchemaOptions,
} from "./base.schema";

const BestBookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    examId: {
      type: Types.ObjectId,
      ref: "Exam",
      required: true,
      index: true,
    },

    subExamId: {
      type: Types.ObjectId,
      ref: "SubExam",
      required: true,
      index: true,
    },

    subjectId: {
      type: Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },

    imageUrl: {
      type: String,
      default:'/images/sample-book.png'
    },

    description: {
      type: String,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

BestBookSchema.index({ subExamId: 1, subjectId: 1 });

export default models.BestBook || model("BestBook", BestBookSchema);
