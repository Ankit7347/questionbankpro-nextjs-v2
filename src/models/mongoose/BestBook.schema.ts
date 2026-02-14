// src/models/mongoose/BestBook.schema.ts

import { Schema, model, models } from "mongoose";
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
    },

    subject: {
      type: String,
      required: true,
    },

    className: {
      type: String,
      required: true, // "Class 10", "BSc Physics"
    },

    board: {
      type: String,
      required: true, // CBSE / ICSE / JEE etc
    },

    competitive: {
      type: Boolean,
      default: false,
    },

    imageUrl: {
      type: String,
    },

    description: {
      type: String,
    },

    tags: [
      {
        type: String,
      },
    ],

    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

export default models.BestBook || model("BestBook", BestBookSchema);
