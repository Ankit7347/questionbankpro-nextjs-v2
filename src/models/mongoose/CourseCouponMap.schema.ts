// src/models/mongoose/CourseCouponMap.schema.ts

import { Schema, model, models, Types } from "mongoose";
import {
  BaseSchemaFields,
  BaseSchemaOptions,
} from "./base.schema";

const CourseCouponMapSchema = new Schema(
  {
    courseId: {
      type: Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    couponId: {
      type: Types.ObjectId,
      ref: "Coupon",
      required: true,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

CourseCouponMapSchema.index(
  { courseId: 1, couponId: 1 },
  { unique: true }
);

export default models.CourseCouponMap ||
  model("CourseCouponMap", CourseCouponMapSchema);
