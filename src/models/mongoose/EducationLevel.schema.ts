import { Schema, model, models } from "mongoose";
import {
  BaseSchemaFields,
  BaseSchemaOptions,
} from "./base.schema";

const EducationLevelSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["school", "graduation", "postgraduation", "competitive"],
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
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

export const EducationLevelModel =
  models.EducationLevel ||
  model("EducationLevel", EducationLevelSchema);
