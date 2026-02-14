// src/models/mongoose/QuizSubmission.schema.ts
import { Schema, model, models } from "mongoose";
import { BaseSchemaFields, BaseSchemaOptions } from "./base.schema";

const QuizSubmissionSchema = new Schema(
  {
    /* ==========================================
       User & Quiz Reference
    ========================================== */
    userId: {
      type: String,
      required: true,
      index: true,
    },

    quizId: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
      index: true,
    },

    /* ==========================================
       Attempt Details
    ========================================== */
    attemptNumber: {
      type: Number,
      default: 1,
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    submittedAt: {
      type: Date,
    },

    timeSpentSeconds: {
      type: Number,
      default: 0,
    },

    /* ==========================================
       Answers Submitted
    ========================================== */
    answers: [
      {
        questionId: {
          type: Schema.Types.ObjectId,
          ref: "Question",
        },
        selectedOptionId: { type: String }, // for MCQ
        answerText: { type: String }, // for subjective
        isCorrect: { type: Boolean },
        marksAwarded: { type: Number, default: 0 },
      },
    ],

    /* ==========================================
       Scoring & Results
    ========================================== */
    totalMarksObtained: {
      type: Number,
      default: 0,
    },

    totalMarksMaximum: {
      type: Number,
      required: true,
    },

    percentageScore: {
      type: Number,
      default: 0,
    },

    correctAnswersCount: {
      type: Number,
      default: 0,
    },

    wrongAnswersCount: {
      type: Number,
      default: 0,
    },

    unattemptedCount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["in_progress", "submitted", "evaluated"],
      default: "in_progress",
      index: true,
    },

    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

/* Indexes for efficient queries */
QuizSubmissionSchema.index({ userId: 1, quizId: 1 });
QuizSubmissionSchema.index({ userId: 1, status: 1 });
QuizSubmissionSchema.index({ quizId: 1, status: 1 });
QuizSubmissionSchema.index({ submittedAt: -1 });

export default models.QuizSubmission || model("QuizSubmission", QuizSubmissionSchema);
