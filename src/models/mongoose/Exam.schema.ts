import { Schema, model, models } from "mongoose";
import {
  BaseSchemaFields,
  BaseSchemaOptions,
} from "./base.schema";

const ExamSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    examType: {
      type: String,
      enum: ["board", "competitive", "university"],
      required: true,
    },

    conductedBy: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

export const ExamModel =
  models.Exam || model("Exam", ExamSchema);
