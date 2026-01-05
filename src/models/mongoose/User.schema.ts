// src/models/mongoose/User.schema.ts
import { Schema, model, models } from "mongoose";
import {
  BaseSchemaFields,
  BaseSchemaOptions,
} from "./base.schema";

const UserSchema = new Schema(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "contentadmin", "superadmin"],
      default: "student",
    },

    /**
     * ✅ NEW FIELD — UI MODE PREFERENCE
     */
    uiMode: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },

    className: {
      type: String, // Class 10 / BSc / MSc
    },

    competition: {
      type: String, // JEE / NEET / GATE
    },

    stateId: {
      type: Schema.Types.ObjectId,
      ref: "GeolocationState",
    },

    districtId: {
      type: Schema.Types.ObjectId,
      ref: "GeolocationDistrict",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

const User =
  models.User || model("User", UserSchema);

export default User;