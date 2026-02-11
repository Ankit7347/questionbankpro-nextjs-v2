import { Schema, model, models, Types } from "mongoose";
import { BaseSchemaFields, BaseSchemaOptions } from "./base.schema";

const PreviousPaperSchema = new Schema(
  {
    ...BaseSchemaFields,
    title: {
      en: { type: String, required: true, trim: true },
      hi: { type: String, trim: true }
    },
    slug: { type: String, required: true, unique: true, index: true },
    paperCode: { type: String, required: true, uppercase: true, index: true },

    // Relations
    examId: { type: Types.ObjectId, ref: "Exam", required: true, index: true },
    subExamId: { type: Types.ObjectId, ref: "SubExam", required: true, index: true },
    subjectId: { type: Types.ObjectId, ref: "Subject", required: true, index: true },

    year: { type: Number, required: true, index: true },
    session: { type: String, index: true , default: null}, // e.g., "semseter1", "semester2", "annual"

    // Content: Supports PDF URL, Digital Questions, or Both
    contentType: { type: String, enum: ["PDF", "DIGITAL", "BOTH"], default: "PDF" },
    paperUrl: { type: String, default: null },
    questions: [{ type: Types.ObjectId, ref: "Question" }],
    displayOrder: { type: Number, default: 0 },

    // Business & SEO
    isPremium: { type: Boolean, default: false, index: true },
    isVerified: { type: Boolean, default: false, index: true },
    status: { type: String, enum: ["DRAFT", "PUBLISHED", "ARCHIVED"], default: "DRAFT", index: true },

    // Engagement
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    prints: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },

    // Related Papers
    relatedPaperIds: [{type: Types.ObjectId,ref: "PreviousPaper",}],

    // SEO
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: [{ type: String, lowercase: true }],
    tags: [{ type: String, lowercase: true }],

    //Owner & Source
    createdBy: { type: String, required: true }, // UUID of the user who created the paper
    source: { type: String, default: "USER_UPLOAD" }, // e.g., "USER_UPLOAD", "PARTNER_PROVIDED", "SCRAPED"
  },
  { ...BaseSchemaOptions }
);

PreviousPaperSchema.index({ "title.en": "text", "title.hi": "text", paperCode: "text" });

export default models.PreviousPaper || model("PreviousPaper", PreviousPaperSchema);