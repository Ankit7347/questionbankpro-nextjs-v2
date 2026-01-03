// mongoose/ResetToken.schema.ts
import { Schema, model, models } from "mongoose";

const ResetTokenSchema = new Schema({
  email: { type: String, required: true, unique: true },
  token: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 1800, // 30 minutes
  },
});

export const ResetTokenModel =
  models.ResetToken || model("ResetToken", ResetTokenSchema);
