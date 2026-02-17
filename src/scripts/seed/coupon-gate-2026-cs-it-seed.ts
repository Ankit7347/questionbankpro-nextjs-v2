// src/scripts/seed/coupon-gate-2026-cs-it-seed.ts

import { initSeed, closeSeed } from "./_helpers";
import SubExam from "../../models/mongoose/SubExam.schema";
import Course from "../../models/mongoose/Course.schema";
import Coupon from "../../models/mongoose/Coupon.schema";
import CourseCouponMap from "../../models/mongoose/CourseCouponMap.schema";

async function seedCoupons() {
  console.log("📘 Seeding coupons for SubExam: gate-2026-cs-it");
  await initSeed();

  // fetch the subexam to derive course list
  const subExam = await SubExam.findOne({
    slug: "gate-2026-cs-it",
    isActive: true,
    isDeleted: false,
  });

  if (!subExam) {
    throw new Error("❌ SubExam 'gate-2026-cs-it' not found or inactive.");
  }

  const courses = await Course.find({
    subExamId: subExam._id,
    isActive: true,
    isDeleted: false,
  });

  if (courses.length === 0) {
    throw new Error("❌ No courses found for the requested SubExam.");
  }

  // define a couple of promotional coupons
  const coupons = [
    {
      code: "FREE2026",
      discountType: "PERCENT",
      discountValue: 100,    // 100% off
      maxDiscount: null,
      minOrderAmount: null,
      validFrom: new Date("2025-01-01"),
      validTo: new Date("2026-03-31"),
      usageLimit: null,
      perUserLimit: 1,
      isActive: true,
    },
    {
      code: "GATE50",
      discountType: "PERCENT",
      discountValue: 50,
      maxDiscount: 10000,
      minOrderAmount: 1000,
      validFrom: new Date("2025-06-01"),
      validTo: new Date("2026-12-31"),
      usageLimit: null,
      perUserLimit: 1,
      isActive: true,
    },
  ];

  // create / reuse coupon documents
  const savedCoupons: typeof coupons & { _id?: any }[] = [];
  for (const data of coupons) {
    const existing = await Coupon.findOne({ code: data.code });
    if (existing) {
      savedCoupons.push(existing as any);
    } else {
      const created = await Coupon.create(data as any);
      savedCoupons.push(created as any);
    }
  }

  // link each coupon to each course via CourseCouponMap
  let createdMaps = 0;
  for (const couponDoc of savedCoupons) {
    for (const course of courses) {
      const exists = await CourseCouponMap.findOne({
        courseId: course._id,
        couponId: couponDoc._id,
      });
      if (!exists) {
        await CourseCouponMap.create({
          courseId: course._id,
          couponId: couponDoc._id,
        });
        createdMaps++;
      }
    }
  }

  await closeSeed();

  console.log("✅ Coupon seed complete.");
  console.log(`🔗 Mapped ${createdMaps} coupon-to-course entries.`);
}

seedCoupons().catch((err) => {
  console.error("❌ Coupon seeding failed", err);
  process.exit(1);
});
