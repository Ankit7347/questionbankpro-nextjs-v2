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
    uiMode: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },
    className: {
      type: String,
    },
    courseName: {
      type: String,
    },
    competition: {
      type: String,
    },
    stateName: {
      type: String,
    },
    districtName: {
      type: String,
    },
    // ✅ Specific ID fields with your naming convention
    geolocationStateId: {
      type: Schema.Types.ObjectId,
      ref: "GeolocationState",
    },
    geolocationDistrictId: {
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

const User = models.User || model("User", UserSchema);
export default User;