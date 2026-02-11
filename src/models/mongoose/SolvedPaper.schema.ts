import { Schema, model, models, Types } from "mongoose";
import { BaseSchemaFields, BaseSchemaOptions } from "./base.schema";

const SolvedPaperSchema = new Schema(
  {
    ...BaseSchemaFields,
    previousPaperId: { 
      type: Types.ObjectId, 
      ref: "PreviousPaper", 
      required: true, 
      unique: true,
      index: true 
    },
    
    // Solutions
    fullExplanation: { 
      en: { type: String },
      hi: { type: String }
    },
    solutionPdfUrl: { type: String, default: null }, 
    videoSolutionUrl: { type: String, default: null },
    
    // Business & Quality
    isPremium: { type: Boolean, default: false, index: true },
    solutionQuality: { 
      type: String, 
      enum: ["BASIC", "EXPERT_VERIFIED"], 
      default: "BASIC" 
    },

    // Engagement & Ratings (Matched with PreviousPaper)
    views: { type: Number, default: 0 },
    totalLikes: { type: Number, default: 0 },
    averageRating: { type: Number, min: 0, max: 5, default: 0 },
    totalRatings: { type: Number, default: 0 },
  },
  { ...BaseSchemaOptions }
);

export default models.SolvedPaper || model("SolvedPaper", SolvedPaperSchema);