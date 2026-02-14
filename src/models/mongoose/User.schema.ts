// src/models/mongoose/User.schema.ts
import { Schema, model, models } from "mongoose";
import {
  BaseSchemaFields,
  BaseSchemaOptions,
} from "./base.schema";

const UserSchema = new Schema(
  {
    /* =========================
       Core Identity
    ========================== */
    uuid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "contentadmin", "superadmin"],
      default: "student",
    },

    uiMode: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },

    // user preferences (stored under user document for quick access)
    preferences: {
      type: {
        theme: { type: String, enum: ["light", "dark", "system"], default: "system" },
        // additional keys can be added as needed (notifications, language, etc.)
      },
      default: {},
    },

    // dashboard summary fields used by various panels; kept small
    dashboard: {
      type: {
        notes: {
          total: { type: Number, default: 0 },
          lastTopicId: { type: String, default: "" },
        },
        bookmarksCount: { type: Number, default: 0 },
        historySummary: {
          lastViewedAt: { type: Date },
          lastItem: { type: String },
        },
        performanceSummary: {
          quizzesTaken: { type: Number, default: 0 },
          bestScore: { type: Number, default: 0 },
        },
      },
      default: {},
    },

    /* =========================
       Location (ID + Snapshot)
    ========================== */
    stateName: {
      type: String, // e.g. "Uttar Pradesh"
      required: true,
    },

    districtName: {
      type: String, // e.g. "Lucknow"
      required: true,
    },

    geolocationStateId: {
      type: Schema.Types.ObjectId,
      ref: "GeolocationState",
      required: true,
    },

    geolocationDistrictId: {
      type: Schema.Types.ObjectId,
      ref: "GeolocationDistrict",
      required: true,
    },

    /* =========================
       Education (FINAL MODEL)
    ========================== */

    educationLevel: {
      type: String,
      enum: ["school", "ug", "pg"],
      required: true,
      // Academic level ONLY:
      // school | ug | pg
    },

    className: {
      type: String,
      // Academic class / program name
      // Examples:
      // School -> "CBSE Class 6", "CBSE Class 10"
      // UG     -> "BSc Mathematics", "BTech CSE"
      // PG     -> "MSc Physics"
      required: true,
    },

    courseName: {
      type: String,
      // Selected exam / course label shown to user
      // Examples:
      // "CBSE Class 6"
      // "JEE Advanced"
      // "NEET"
      // "BSc Mathematics"
      required: true,
    },

    examType: {
      type: String,
      enum: ["school", "program", "competitive"],
      required: true,
      // Used for reporting, segmentation, access rules
    },

    /* =========================
       SubExam Reference (ID + Slug)
    ========================== */

    subExamId: {
      type: Schema.Types.ObjectId,
      ref: "SubExam",
      // Reference to selected SubExam document
      required: true,
    },

    subExamSlug: {
      type: String,
      // Stable slug for selected SubExam
      // Examples:
      // "cbse-class-6"
      // "jee-advanced"
      // "neet"
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

const User = models.User || model("User", UserSchema);
export default User;
