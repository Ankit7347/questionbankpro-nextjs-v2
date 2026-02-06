// src/models/mongoose/SolvedPaper.schema.ts

import { Schema, model, models, Types } from "mongoose";
import {
  BaseSchemaFields,
  BaseSchemaOptions,
} from "./base.schema";

// Sub-schema for Solution Steps
const SolutionStepSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },

    // Step Metadata
    stepNumber: {
      type: Number,
      required: true,
    },

    title: {
      type: String,
      default: null,
    },

    // Content
    body: {
      type: String,
      required: true,
      // Can contain LaTeX: $inline$ or $$block$$
    },

    // Formatting hint
    hasLatex: {
      type: Boolean,
      default: false,
      index: false,
    },

    // Breakdown
    conceptTags: [
      {
        type: String,
        lowercase: true,
      },
    ],

    // Quality Flags
    isVerified: {
      type: Boolean,
      default: false,
    },

    verifiedBy: {
      type: String, // User UUID
      default: null,
    },

    // Difficulty of this step
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },

    // Alternative explanations
    alternativeExplanations: [
      {
        type: String,
      },
    ],

    // Common mistakes
    commonMistakes: [
      {
        type: String,
      },
    ],

    // Learning references
    relatedTopicIds: [
      {
        type: Types.ObjectId,
        ref: "Topic",
      },
    ],

    // User feedback
    helpfulCount: {
      type: Number,
      default: 0,
    },

    unhelpfulCount: {
      type: Number,
      default: 0,
    },

    // Timestamps for audit
    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const SolvedPaperSchema = new Schema(
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

    previousPaperId: {
      type: Types.ObjectId,
      ref: "PreviousPaper",
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
      index: true,
    },

    // Paper Content Metrics
    questionCount: {
      type: Number,
      required: true,
    },

    totalMarks: {
      type: Number,
      default: null,
    },

    estimatedDuration: {
      type: Number, // in minutes
      default: null,
    },

    // Difficulty Assessment
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard", "Mixed"],
      required: true,
      index: true,
    },

    // Description
    shortDescription: {
      en: { type: String },
      hi: { type: String },
    },

    fullDescription: {
      en: { type: String },
      hi: { type: String },
    },

    // Solutions Content
    solutions: {
      type: [SolutionStepSchema],
      default: [],
    },

    // Metadata & Search Optimization
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

    topicsCosineCovered: [
      {
        topicId: Types.ObjectId,
        topicName: String,
      },
    ],

    // Quality & Verification
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    verifiedBy: {
      type: String, // User UUID (Expert/Admin)
      default: null,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    solutionQuality: {
      type: String,
      enum: ["DRAFT", "BASIC", "COMPLETE", "EXPERT_VERIFIED"],
      default: "BASIC",
      index: true,
    },

    // Creator Information
    createdBy: {
      type: String, // User UUID (Expert)
      required: true,
      index: true,
    },

    creatorExpertiseLevel: {
      type: String,
      enum: ["COMMUNITY", "CONTRIBUTOR", "EXPERT", "VERIFIED_EXPERT"],
      default: "COMMUNITY",
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

    // Rating System
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

    // Community Engagement
    totalComments: {
      type: Number,
      default: 0,
    },

    totalLikes: {
      type: Number,
      default: 0,
    },

    totalBookmarks: {
      type: Number,
      default: 0,
    },

    // Learning Analytics
    averageTimeSpent: {
      type: Number, // in seconds
      default: 0,
    },

    completionRate: {
      type: Number, // percentage
      min: 0,
      max: 100,
      default: 0,
    },

    // Administrative Fields
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "FEATURED", "ARCHIVED", "DELETED"],
      default: "DRAFT",
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
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

    // Publishing Dates
    publishedAt: {
      type: Date,
      default: null,
    },

    featuredAt: {
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

    canonicalUrl: {
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
        ref: "SolvedPaper",
      },
    ],

    // Accessibility
    hasEnglishSolution: {
      type: Boolean,
      default: true,
    },

    hasHindiSolution: {
      type: Boolean,
      default: false,
    },

    hasVideoSolution: {
      type: Boolean,
      default: false,
    },

    videoUrl: {
      type: String,
      default: null,
    },

    // Community Flags
    communityNotes: [
      {
        userId: String,
        note: String,
        createdAt: Date,
      },
    ],

    // Base Fields (timestamps, isDeleted, updatedBy)
    ...BaseSchemaFields,
  },
  {
    ...BaseSchemaOptions,
    collection: "solved_papers",
  }
);

// Indexes for Performance
SolvedPaperSchema.index({ examId: 1, year: 1 });
SolvedPaperSchema.index({ subjectId: 1, year: 1 });
SolvedPaperSchema.index({ courseId: 1, year: 1 });
SolvedPaperSchema.index({ createdBy: 1, status: 1 });
SolvedPaperSchema.index({ status: 1, visibility: 1 });
SolvedPaperSchema.index({ isVerified: 1, isPremium: 1 });
SolvedPaperSchema.index({ createdAt: -1 });
SolvedPaperSchema.index({ views: -1 }); // For trending papers
SolvedPaperSchema.index({ totalRatings: -1 }); // For best-rated papers
SolvedPaperSchema.index({ difficulty: 1, subject: 1 }); // For filtering
SolvedPaperSchema.index({ isFeatured: 1, publishedAt: -1 }); // For featured section

export const SolvedPaper =
  models.SolvedPaper || model("SolvedPaper", SolvedPaperSchema);
