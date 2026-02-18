// src/models/mongoose/Bookmark.schema.ts
import { Schema, Types, model, models } from "mongoose";
import { BaseSchemaFields, BaseSchemaOptions } from "./base.schema";

const BookmarkSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    itemType: {
      type: String,
      required: true,
      enum: ["topic", "chapter", "subject", "paper", "note", "other"],
    },
    itemId: {
      type: String,
      required: true,
    },
    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);


export default models.Bookmark || model("Bookmark", BookmarkSchema);
