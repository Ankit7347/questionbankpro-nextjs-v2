import { Schema, model, models } from "mongoose";
import {
  BaseSchemaFields,
  BaseSchemaOptions,
} from "./base.schema";

const SubjectSchema = new Schema(
  {
    syllabusId: {
      type: Schema.Types.ObjectId,
      ref: "Syllabus",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
    },

    code: {
      type: String,
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

export const SubjectModel =
  models.Subject || model("Subject", SubjectSchema);
