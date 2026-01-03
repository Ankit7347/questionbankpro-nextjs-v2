// mongoose/BestBook.schema.ts
import { Schema, model, models } from "mongoose";
import { BaseSchemaFields, BaseSchemaOptions } from "./base.schema";

const BestBookSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    subject: { type: String, required: true },
    className: { type: String, required: true },
    board: { type: String, required: true },
    competitive: { type: Boolean, default: false },
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

export const BestBookModel =
  models.BestBook || model("BestBook", BestBookSchema);
