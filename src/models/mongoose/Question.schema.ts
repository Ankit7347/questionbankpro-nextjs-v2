import { Schema, model, models, Types } from "mongoose";
import { BaseSchemaFields, BaseSchemaOptions } from "./base.schema";

const QuestionSchema = new Schema(
  {
    ...BaseSchemaFields,
    content: { 
      en: { type: String, required: true },
      hi: { type: String } 
    },
    type: { type: String, enum: ["MCQ", "SUBJECTIVE", "TRUE_FALSE"], default: "MCQ" },
    options: [{
      text: { 
        en: { type: String, required: true },
        hi: { type: String }
      },
      isCorrect: { type: Boolean, default: false }
    }],
    explanation: { 
      en: { type: String },
      hi: { type: String }
    },
    marks: { type: Number, default: 1 },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
    displayOrder: { type: Number, default: 0 },
    
    subjectId: { type: Types.ObjectId, ref: "Subject", index: true },
    chapterId: { type: Types.ObjectId, ref: "Chapter", index: true },
    topicId: { type: Types.ObjectId, ref: "Topic", index: true },
    images: [{ type: String }], 
  },
  { ...BaseSchemaOptions }
);

export default models.Question || model("Question", QuestionSchema);