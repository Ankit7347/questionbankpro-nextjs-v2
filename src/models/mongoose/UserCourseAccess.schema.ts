// src/models/mongoose/UserCourseAccess.schema.ts

import { Schema, model, models, Types } from "mongoose";
import {
  BaseSchemaFields,
  BaseSchemaOptions,
} from "./base.schema";

/**
 * UserCourseAccess
 * ----------------
 * Source of truth for:
 * - Course purchase / enrollment
 * - User access rights
 *
 * NOT a syllabus owner
 * NOT a pricing owner
 */
const UserCourseAccessSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    courseId: {
      type: Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    subExamId: {
      type: Types.ObjectId,
      ref: "SubExam",
      required: true,
      index: true,
    },

    accessType: {
      type: String,
      enum: ["FREE", "PAID"],
      required: true,
    },

    pricePaid: {
      type: Number,
      default: 0,
      min: 0,
    },

    couponId: {
      type: Types.ObjectId,
      ref: "Coupon",
      default: null,
    },

    enrolledAt: {
      type: Date,
      default: Date.now,
    },

    accessValidTill: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "EXPIRED", "REVOKED"],
      default: "ACTIVE",
      index: true,
    },
  },
  {
    ...BaseSchemaOptions,
  }
);

/**
 * Enforce one active access per user per course
 */
UserCourseAccessSchema.index(
  { userId: 1, courseId: 1 },
  { unique: true }
);

export default
  models.UserCourseAccess ||
  model("UserCourseAccess", UserCourseAccessSchema);
