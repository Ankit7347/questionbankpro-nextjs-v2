// Question.schema.ts
import { Schema, model, models } from "mongoose";
import { BaseSchemaFields, BaseSchemaOptions } from "./base.schema";

const QuestionSchema = new Schema(
  {
    topicId: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["mcq", "numerical", "true_false"],
      required: true,
    },
    questionText: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    isPreviousYear: { type: Boolean, default: false },
    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

export const QuestionModel =
  models.Question || model("Question", QuestionSchema);
