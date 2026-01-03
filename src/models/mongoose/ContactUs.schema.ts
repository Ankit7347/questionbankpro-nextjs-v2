// mongoose/ContactUs.schema.ts
import { Schema, model, models } from "mongoose";
import { BaseSchemaFields, BaseSchemaOptions } from "./base.schema";

const ContactUsSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    text: { type: String, required: true },
    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

export const ContactUsModel =
  models.ContactUs || model("ContactUs", ContactUsSchema);
