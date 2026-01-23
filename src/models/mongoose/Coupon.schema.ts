// src/models/mongoose/Coupon.schema.ts

import { Schema, model, models } from "mongoose";
import {
  BaseSchemaFields,
  BaseSchemaOptions,
} from "./base.schema";

const CouponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    discountType: {
      type: String,
      enum: ["FLAT", "PERCENT"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
    },

    maxDiscount: {
      type: Number,
      default: null, // useful for PERCENT
    },

    minOrderAmount: {
      type: Number,
      default: null,
    },

    validFrom: {
      type: Date,
      required: true,
    },

    validTo: {
      type: Date,
      default: null,
    },

    usageLimit: {
      type: Number,
      default: null, // global limit
    },

    perUserLimit: {
      type: Number,
      default: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

export default models.Coupon || model("Coupon", CouponSchema);
