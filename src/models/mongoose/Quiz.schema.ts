// Quiz.schema.ts
import { Schema, model, models } from "mongoose";
import { BaseSchemaFields, BaseSchemaOptions } from "./base.schema";

const QuizSchema = new Schema(
  {
    title: { type: String, required: true },
    quizType: {
      type: String,
      enum: [
        "topic",
        "chapter",
        "subject",
        "full_syllabus",
        "mock_test",
      ],
      required: true,
    },
    linkedEntityId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    totalQuestions: { type: Number, required: true },
    durationMinutes: { type: Number, required: true },
    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

export const QuizModel =
  models.Quiz || model("Quiz", QuizSchema);
