// src/services/server/coupon.server.ts

import dbConnect from "@/lib/mongodb";
import Coupon from "@/models/mongoose/Coupon.schema";
import { mapCouponDTO } from "@/models/dto/coupon.mapper";
import {
  BadRequest,
  NotFound,
} from "@/lib/apiError";

/* =========================================================
   LIST ALL COUPONS (Admin)
========================================================= */
export async function listCoupons() {
  await dbConnect();

  const coupons = await Coupon.find({
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .lean();

  return coupons.map(mapCouponDTO);
}

/* =========================================================
   CREATE COUPON (Admin)
========================================================= */
export async function createCoupon(payload: any) {
  await dbConnect();

  if (!payload?.code) {
    throw BadRequest("Coupon code is required");
  }

  const existing = await Coupon.findOne({
    code: payload.code,
    isDeleted: false,
  });

  if (existing) {
    throw BadRequest("Coupon code already exists");
  }

  const coupon = await Coupon.create(payload);
  return mapCouponDTO(coupon.toObject());
}

/* =========================================================
   GET COUPON BY ID (Admin)
========================================================= */
export async function getCouponById(couponId: string) {
  await dbConnect();

  const coupon = await Coupon.findOne({
    _id: couponId,
    isDeleted: false,
  }).lean();

  if (!coupon) {
    throw NotFound("Coupon not found");
  }

  return mapCouponDTO(coupon);
}

/* =========================================================
   UPDATE COUPON (Admin)
========================================================= */
export async function updateCouponById(
  couponId: string,
  payload: any
) {
  await dbConnect();

  const coupon = await Coupon.findOneAndUpdate(
    { _id: couponId, isDeleted: false },
    { $set: payload },
    { new: true }
  ).lean();

  if (!coupon) {
    throw NotFound("Coupon not found");
  }

  return mapCouponDTO(coupon);
}

/* =========================================================
   DELETE COUPON (Soft Delete)
========================================================= */
export async function deleteCouponById(couponId: string) {
  await dbConnect();

  const coupon = await Coupon.findOneAndUpdate(
    { _id: couponId, isDeleted: false },
    { $set: { isDeleted: true } },
    { new: true }
  ).lean();

  if (!coupon) {
    throw NotFound("Coupon not found");
  }

  return { id: couponId };
}

/* =========================================================
   TOGGLE COUPON ACTIVE (Operational)
========================================================= */
export async function toggleCouponActive(payload: {
  couponId: string;
  isActive: boolean;
}) {
  await dbConnect();

  const { couponId, isActive } = payload;

  if (!couponId) {
    throw BadRequest("couponId is required");
  }

  const coupon = await Coupon.findOneAndUpdate(
    { _id: couponId, isDeleted: false },
    { $set: { isActive } },
    { new: true }
  ).lean();

  if (!coupon) {
    throw NotFound("Coupon not found");
  }

  return {
    id: couponId,
    isActive: coupon.isActive,
  };
}
