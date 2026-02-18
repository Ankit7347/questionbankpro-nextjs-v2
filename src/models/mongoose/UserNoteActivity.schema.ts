// src/models/mongoose/UserNoteActivity.schema.ts
/**
 * User Note Activity Schema
 * =========================
 * Tracks user interaction with notes:
 * - Time spent reading
 * - Last access time
 * - Total read count
 * - Progress tracking
 */

import { Schema, model, models, Types } from "mongoose";
import {
  BaseSchemaFields,
  BaseSchemaOptions,
} from "./base.schema";

const UserNoteActivitySchema = new Schema(
  {
    /* =========================
       User & Note Reference
    ========================== */
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    noteId: {
      type: Types.ObjectId,
      ref: "Note",
      required: true,
      index: true,
    },

    /* =========================
       Activity Metrics
    ========================== */
    timeSpent: {
      type: Number,
      default: 0, // in seconds
      description: "Total time spent reading this note",
    },

    lastActive: {
      type: Date,
      default: Date.now,
      index: true,
      description: "Last time user accessed this note",
    },

    readCount: {
      type: Number,
      default: 0,
      description: "Total times note was viewed",
    },

    readTime: {
      type: Number,
      default: 0, // in seconds
      description: "Time spent in current reading session",
    },

    isRead: {
      type: Boolean,
      default: false,
      description: "Whether user has marked as read",
    },

    isBookmarked: {
      type: Boolean,
      default: false,
      index: true,
      description: "Whether user has bookmarked this note",
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
      description: "User rating for the note",
    },

    personalNotes: {
      type: String,
      default: "",
      description: "User's personal annotations/notes on this note",
    },

    highlightedText: [
      {
        text: String,
        color: String,
        position: Number,
      },
    ],

    /* =========================
       Session Tracking
    ========================== */
    sessionStartTime: {
      type: Date,
      description: "When current session started",
    },

    totalSessions: {
      type: Number,
      default: 0,
      description: "Total number of reading sessions",
    },

    /* =========================
       Metadata
    ========================== */
    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

// Compound indexes for efficient queries
UserNoteActivitySchema.index({ userId: 1, noteId: 1 }, { unique: true });
UserNoteActivitySchema.index({ userId: 1, lastActive: -1 });
UserNoteActivitySchema.index({ userId: 1, isBookmarked: 1 });
UserNoteActivitySchema.index({ userId: 1, createdAt: -1 });
UserNoteActivitySchema.index({ noteId: 1, readCount: -1 });

export default models.UserNoteActivity || model("UserNoteActivity", UserNoteActivitySchema);
