// src/models/mongoose/PreviousPaper.schema.ts

import { Schema, model, models, Types } from "mongoose";
import {
  BaseSchemaFields,
  BaseSchemaOptions,
} from "./base.schema";

const PreviousPaperSchema = new Schema(
  {
    // Primary Identifiers
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
    },

    paperCode: {
      type: String,
      required: true,
      uppercase: true,
      index: true,
      trim: true,
    },

    // Relations
    examId: {
      type: Types.ObjectId,
      ref: "Exam",
      required: true,
      index: true,
    },

    subExamId: {
      type: Types.ObjectId,
      ref: "SubExam",
      index: true,
    },

    courseId: {
      type: Types.ObjectId,
      ref: "Course",
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
      index: true,
    },

    // Paper Details
    year: {
      type: Number,
      required: true,
      index: true,
    },

    session: {
      type: String,
      enum: ["Spring", "Summer", "Fall", "Winter", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      required: true,
      index: true,
    },

    duration: {
      type: Number, // in minutes
      default: null,
    },

    totalMarks: {
      type: Number,
      default: null,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard", "Mixed"],
      default: "Mixed",
      index: true,
    },

    // Content Files
    paperUrl: {
      type: String,
      required: true, // S3 or CDN URL
    },

    markingSchemeUrl: {
      type: String,
      default: null,
    },

    solutionUrl: {
      type: String,
      default: null,
    },

    additionalResourcesUrls: [
      {
        type: String,
      },
    ],

    // Metadata & Search Optimization
    description: {
      en: { type: String },
      hi: { type: String },
    },

    keywords: [
      {
        type: String,
        lowercase: true,
      },
    ],

    searchText: {
      type: String,
      index: true,
    },

    // Quality & Rights
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    verifiedBy: {
      type: String, // User UUID / ID
      default: null,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    isCopyrighted: {
      type: Boolean,
      default: false,
    },

    copyrightHolder: {
      type: String,
      default: null,
    },

    copyrightLicense: {
      type: String,
      enum: ["CC_BY", "CC_BY_SA", "CC_BY_NC", "PROPRIETARY", "PUBLIC_DOMAIN"],
      default: "PROPRIETARY",
    },

    // Access Control
    visibility: {
      type: String,
      enum: ["PUBLIC", "INTERNAL", "PREMIUM", "RESTRICTED"],
      default: "PUBLIC",
      index: true,
    },

    isPremium: {
      type: Boolean,
      default: false,
      index: true,
    },

    accessLevel: {
      type: String,
      enum: ["FREE", "PREMIUM", "BETA", "INTERNAL"],
      default: "FREE",
      index: true,
    },

    validFrom: {
      type: Date,
      default: null,
    },

    validTo: {
      type: Date,
      default: null,
    },

    // Engagement & Analytics
    views: {
      type: Number,
      default: 0,
      index: false,
    },

    downloads: {
      type: Number,
      default: 0,
      index: false,
    },

    prints: {
      type: Number,
      default: 0,
      index: false,
    },

    shares: {
      type: Number,
      default: 0,
      index: false,
    },

    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    totalRatings: {
      type: Number,
      default: 0,
    },

    totalComments: {
      type: Number,
      default: 0,
    },

    // Bookmarking & User Interactions
    totalBookmarks: {
      type: Number,
      default: 0,
    },

    // Administrative Fields
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "ARCHIVED", "DELETED"],
      default: "DRAFT",
      index: true,
    },

    priority: {
      type: Number,
      default: 0, // Higher = more priority for display
    },

    displayOrder: {
      type: Number,
      default: 0,
    },

    // Audit Trail
    createdBy: {
      type: String, // User UUID
      required: true,
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    lastSyncedAt: {
      type: Date,
      default: null,
    },

    // SEO Fields
    metaTitle: {
      type: String,
    },

    metaDescription: {
      type: String,
    },

    ogImageUrl: {
      type: String,
    },

    // Tags for Categorization
    tags: [
      {
        type: String,
        lowercase: true,
      },
    ],

    // Related Papers
    relatedPaperIds: [
      {
        type: Types.ObjectId,
        ref: "PreviousPaper",
      },
    ],

    // Base Fields (timestamps, isDeleted, updatedBy)
    ...BaseSchemaFields,
  },
  {
    ...BaseSchemaOptions,
    collection: "previous_papers",
  }
);

// Indexes for Performance
PreviousPaperSchema.index({ examId: 1, year: 1, session: 1 });
PreviousPaperSchema.index({ subjectId: 1, year: 1 });
PreviousPaperSchema.index({ courseId: 1, year: 1 });
PreviousPaperSchema.index({ status: 1, visibility: 1 });
PreviousPaperSchema.index({ isVerified: 1, isPremium: 1 });
PreviousPaperSchema.index({ createdAt: -1 });
PreviousPaperSchema.index({ views: -1 }); // For sorting by popularity
PreviousPaperSchema.index({ year: -1, session: 1 }); // For chronological browsing

export default models.PreviousPaper || model("PreviousPaper", PreviousPaperSchema);
