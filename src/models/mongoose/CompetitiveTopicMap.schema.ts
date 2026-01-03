// CompetitiveTopicMap.schema.ts
import { Schema, model, models } from "mongoose";
import { BaseSchemaFields, BaseSchemaOptions } from "./base.schema";

const CompetitiveTopicMapSchema = new Schema(
  {
    examId: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
      index: true,
    },
    topicId: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
      index: true,
    },
    weightage: { type: Number },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
    },
    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

CompetitiveTopicMapSchema.index(
  { examId: 1, topicId: 1 },
  { unique: true }
);

export const CompetitiveTopicMapModel =
  models.CompetitiveTopicMap ||
  model("CompetitiveTopicMap", CompetitiveTopicMapSchema);
