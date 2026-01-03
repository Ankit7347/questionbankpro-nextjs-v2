// Topic.schema.ts
import { Schema, model, models } from "mongoose";
import { BaseSchemaFields, BaseSchemaOptions } from "./base.schema";

const TopicSchema = new Schema(
  {
    chapterId: {
      type: Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
    },
    isCoreTopic: { type: Boolean, default: false },
    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

export const TopicModel =
  models.Topic || model("Topic", TopicSchema);
