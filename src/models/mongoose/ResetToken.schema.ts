// src/models/mongoose/ResetToken.schema.ts
import { Schema, model, models } from "mongoose";
import {
  BaseSchemaFields,
  BaseSchemaOptions,
} from "./base.schema";

const ResetTokenSchema = new Schema({
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },

    token: {
      type: String,
      required: true,
      unique: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 30, // 30 minutes
    },
    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

const ResetToken =
  models.ResetToken || model("ResetToken", ResetTokenSchema);

export default ResetToken;