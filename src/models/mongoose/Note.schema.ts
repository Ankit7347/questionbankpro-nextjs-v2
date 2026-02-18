// src/models/mongoose/Note.schema.ts
import { Schema, model, models, Types } from "mongoose";
import {
  BaseSchemaFields,
  BaseSchemaOptions,
} from "./base.schema";

const NoteSchema = new Schema(
  {
    /* =========================
       Admin Context
    ========================== */
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    content: {
      type: String,
      default: "",
    },

    /* =========================
       Academic Context
    ========================== */
    subExamId: {
      type: Types.ObjectId,
      ref: "SubExam",
      required: true,
      index: true,
    },

    subjectId: {
      type: Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },

    chapterId: {
      type: Types.ObjectId,
      ref: "Chapter",
      default: null,
      index: true,
    },

    topicId: {
      type: Types.ObjectId,
      ref: "Topic",
      default: null,
      index: true,
    },

    /* =========================
       Status & Engagement
    ========================== */
    isPinned: {
      type: Boolean,
      default: false,
      index: true,
    },

    isPublic: {
      type: Boolean,
      default: false,
    },

    views: {
      type: Number,
      default: 0,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    /* =========================
       Attachments & Media
    ========================== */
    attachments: [
      {
        url: { type: String },
        name: { type: String },
        type: { type: String }, // image, pdf, video, etc.
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    /* =========================
       Metadata
    ========================== */
    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

// Indexes for common queries
NoteSchema.index({ subjectId: 1, createdAt: -1 });
NoteSchema.index({ chapterId: 1, createdAt: -1 });
NoteSchema.index({ topicId: 1, createdAt: -1 });
NoteSchema.index({ isPinned: 1, createdAt: -1 });

export default models.Note || model("Note", NoteSchema);
