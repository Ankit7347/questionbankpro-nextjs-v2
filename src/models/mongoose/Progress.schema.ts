// src/models/mongoose/Progress.schema.ts
import { Schema, model, models } from "mongoose";
import { BaseSchemaFields, BaseSchemaOptions } from "./base.schema";

const ProgressSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    subjectId: { type: String, required: false },
    chapterId: { type: String, required: false },
    topicId: { type: String, required: false },
    progress: { type: Number, default: 0 }, // percent or units
    lastAccessed: { type: Date, default: Date.now },
    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);


export default models.Progress || model("Progress", ProgressSchema);
