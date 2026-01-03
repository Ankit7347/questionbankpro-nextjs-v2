// mongoose/User.schema.ts
import { Schema, model, models } from "mongoose";
import { BaseSchemaFields, BaseSchemaOptions } from "./base.schema";

const UserSchema = new Schema(
  {
    uuid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    state: { type: String },
    district: { type: String },
    className: { type: String },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "superadmin", "contentadmin"],
      default: "student",
    },
    competition: { type: String },
    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

export const UserModel =
  models.User || model("User", UserSchema);
