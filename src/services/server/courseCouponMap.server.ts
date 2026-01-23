// src/services/server/courseCouponMap.server.ts

import dbConnect from "@/lib/mongodb";
import Course from "@/models/mongoose/Course.schema";
import Coupon from "@/models/mongoose/Coupon.schema";
import CourseCouponMap from "@/models/mongoose/CourseCouponMap.schema";
import {
  BadRequest,
  NotFound,
} from "@/lib/apiError";

/* =========================================================
   LINK COUPON TO COURSE (Admin)
========================================================= */
export async function attachCouponToCourse(payload: {
  courseId: string;
  couponId: string;
}) {
  await dbConnect();

  const { courseId, couponId } = payload;

  if (!courseId || !couponId) {
    throw BadRequest("courseId and couponId are required");
  }

  const courseExists = await Course.exists({
    _id: courseId,
    isDeleted: false,
  });

  if (!courseExists) {
    throw NotFound("Course not found");
  }

  const couponExists = await Coupon.exists({
    _id: couponId,
    isDeleted: false,
  });

  if (!couponExists) {
    throw NotFound("Coupon not found");
  }

  const alreadyLinked = await CourseCouponMap.findOne({
    courseId,
    couponId,
    isDeleted: false,
  });

  if (alreadyLinked) {
    throw BadRequest("Coupon already attached to this course");
  }

  const map = await CourseCouponMap.create({
    courseId,
    couponId,
  });

  return {
    id: map._id.toString(),
    courseId,
    couponId,
  };
}

/* =========================================================
   DETACH COUPON FROM COURSE (Admin)
========================================================= */
export async function detachCouponFromCourse(payload: {
  courseId: string;
  couponId: string;
}) {
  await dbConnect();

  const { courseId, couponId } = payload;

  if (!courseId || !couponId) {
    throw BadRequest("courseId and couponId are required");
  }

  const map = await CourseCouponMap.findOneAndUpdate(
    {
      courseId,
      couponId,
      isDeleted: false,
    },
    { $set: { isDeleted: true } },
    { new: true }
  ).lean();

  if (!map) {
    throw NotFound("Course–Coupon mapping not found");
  }

  return {
    courseId,
    couponId,
  };
}

/* =========================================================
   LIST COUPONS ATTACHED TO A COURSE (Admin)
========================================================= */
export async function listCouponsForCourse(courseId: string) {
  await dbConnect();

  if (!courseId) {
    throw BadRequest("courseId is required");
  }

  const mappings = await CourseCouponMap.find({
    courseId,
    isDeleted: false,
  })
    .select("couponId")
    .lean();

  return mappings.map((m) => m.couponId.toString());
}
