import { Schema, model, models } from "mongoose";
import {
  BaseSchemaFields,
  BaseSchemaOptions,
} from "./base.schema";

const QuizSchema = new Schema(
  {
    /* ==========================================
       Title & Metadata
    ========================================== */
    title: {
      en: { type: String, required: true },
      hi: { type: String },
    },

    description: {
      en: { type: String },
      hi: { type: String },
    },

    quizType: {
      type: String,
      enum: ["topic", "chapter", "subject", "full_syllabus", "mock_test"],
      required: true,
      index: true,
    },

    /* ==========================================
       Hierarchy: Exam → SubExam → Subject → Chapter → Topic
    ========================================== */
    examId: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
      index: true,
    },

    subExamId: {
      type: Schema.Types.ObjectId,
      ref: "SubExam",
      required: true,
      index: true,
    },

    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      // required only for non-full-syllabus quizzes
    },

    chapterId: {
      type: Schema.Types.ObjectId,
      ref: "Chapter",
      // required only for chapter/topic level quizzes
    },

    topicId: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      // required only for topic-level quizzes
    },

    /* ==========================================
       Question Configuration
    ========================================== */
    questionIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
    },

    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },

    totalMarks: {
      type: Number,
      required: true,
      min: 1,
    },

    marksPerQuestion: {
      type: Number,
      default: 1,
    },

    negativeMarking: {
      enabled: { type: Boolean, default: false },
      marksPerWrongAnswer: { type: Number, default: 0 },
    },

    /* ==========================================
       Display & Timing
    ========================================== */
    displayOrder: { type: Number, default: 0 },

    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },

    publishedAt: { type: Date },
    startDate: { type: Date },
    endDate: { type: Date },

    allowMultipleAttempts: {
      type: Boolean,
      default: true,
    },

    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

/* Composite indexes for efficient queries */
QuizSchema.index({ examId: 1, subExamId: 1 });
QuizSchema.index({ subExamId: 1, subjectId: 1, chapterId: 1, topicId: 1 });
QuizSchema.index({ isPublished: 1, publishedAt: -1 });

export default models.Quiz || model("Quiz", QuizSchema);
