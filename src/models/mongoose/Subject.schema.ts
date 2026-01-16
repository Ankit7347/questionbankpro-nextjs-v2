// src/models/mongoose/Subject.schema.ts

import { Schema, model, models } from "mongoose";
import {
  BaseSchemaFields,
  BaseSchemaOptions,
} from "./base.schema";

const SubjectSchema = new Schema(
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

    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

export default models.Subject || model("Subject", SubjectSchema);
