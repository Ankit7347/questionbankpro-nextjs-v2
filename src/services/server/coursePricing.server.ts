// src/services/server/coursePricing.server.ts

import dbConnect from "@/lib/mongodb";
import Course from "@/models/mongoose/Course.schema";
import Coupon from "@/models/mongoose/Coupon.schema";
import CourseCouponMap from "@/models/mongoose/CourseCouponMap.schema";
import { mapCouponDTO } from "@/models/dto/coupon.mapper";
import { BadRequest, NotFound } from "@/lib/apiError";

export async function resolveCoursePricing(payload: {
  courseId: string;
  couponCode?: string;
}) {
  await dbConnect();

  const { courseId, couponCode } = payload;

  if (!courseId) {
    throw BadRequest("courseId is required");
  }

  const course = await Course.findOne({
    _id: courseId,
    isActive: true,
    isDeleted: false,
  }).lean();

  if (!course) {
    throw NotFound("Course not found or inactive");
  }

  const basePrice = course.basePrice;
  const salePrice = course.salePrice;

  let finalPrice = salePrice;
  let discountApplied = 0;
  let couponDTO = null;

  if (!couponCode) {
    return {
      courseId,
      basePrice,
      salePrice,
      finalPrice,
      discountApplied,
      coupon: null,
    };
  }

  const coupon = await Coupon.findOne({
    code: couponCode,
    isActive: true,
    isDeleted: false,
  }).lean();

  if (!coupon) {
    throw NotFound("Invalid or expired coupon");
  }

  const isApplicable = await CourseCouponMap.exists({
    courseId: course._id,
    couponId: coupon._id,
    isDeleted: false,
  });

  if (!isApplicable) {
    throw BadRequest("Coupon not applicable to this course");
  }

  const now = new Date();

  if (
    (coupon.validFrom && coupon.validFrom > now) ||
    (coupon.validTo && coupon.validTo < now)
  ) {
    throw BadRequest("Coupon is not valid at this time");
  }

  if (coupon.discountType === "PERCENT") {
    discountApplied = Math.floor(
      (salePrice * coupon.discountValue) / 100
    );
  }

  if (coupon.discountType === "FLAT") {
    discountApplied = coupon.discountValue;
  }

  if (coupon.maxDiscount) {
    discountApplied = Math.min(
      discountApplied,
      coupon.maxDiscount
    );
  }

  finalPrice = Math.max(0, salePrice - discountApplied);
  couponDTO = mapCouponDTO(coupon);

  return {
    courseId,
    basePrice,
    salePrice,
    finalPrice,
    discountApplied,
    coupon: couponDTO,
  };
}
