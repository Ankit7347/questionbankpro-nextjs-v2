// src/app/api/dashboard/coupon/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Coupon from "@/models/mongoose/Coupon.schema";
import Course from "@/models/mongoose/Course.schema";
import CourseCouponMap from "@/models/mongoose/CourseCouponMap.schema";

/**
 * POST /api/dashboard/coupon
 * Validates a coupon code for a specific course and returns discount details.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: Please login to check coupons",
          statusCode: 401,
        },
        { status: 401 }
      );
    }

    // 2. Parse Request
    const body = await req.json();
    const { code, courseSlug } = body;

    if (!code || !courseSlug) {
      return NextResponse.json(
        {
          success: false,
          message: "Coupon code and Course slug are required",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    await dbConnect();

    // 3. Fetch Course
    const course = await Course.findOne({ slug: courseSlug, isActive: true });
    if (!course) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Course",
          statusCode: 404,
        },
        { status: 404 }
      );
    }

    // 4. Fetch Coupon
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Coupon Code",
          statusCode: 404,
        },
        { status: 404 }
      );
    }

    // 5. Validate Dates
    const now = new Date();
    if (new Date(coupon.validFrom) > now) {
      return NextResponse.json(
        {
          success: false,
          message: "Coupon is not yet active",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    if (coupon.validTo && new Date(coupon.validTo) < now) {
      return NextResponse.json(
        {
          success: false,
          message: "Coupon has expired",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    // 6. Validate Course Mapping
    // Check if this coupon is explicitly mapped to the selected course
    const isMapped = await CourseCouponMap.findOne({
      courseId: course._id,
      couponId: coupon._id,
      isActive: true,
    });

    if (!isMapped) {
      return NextResponse.json(
        {
          success: false,
          message: "This coupon is not applicable to the selected course",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    // 7. Validate Minimum Order Amount
    const price = course.salePrice; // Using salePrice as the transaction amount
    if (coupon.minOrderAmount && price < coupon.minOrderAmount) {
      return NextResponse.json(
        {
          success: false,
          message: `Minimum order amount of ₹${coupon.minOrderAmount} required`,
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    // 8. Calculate Discount
    let discountAmount = 0;
    if (coupon.discountType === "FLAT") {
      discountAmount = coupon.discountValue;
    } else if (coupon.discountType === "PERCENT") {
      discountAmount = (price * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    }

    // Cap discount at price (cannot be negative)
    if (discountAmount > price) {
      discountAmount = price;
    }

    const finalPrice = price - discountAmount;

    return NextResponse.json(
      {
        success: true,
        message: "Coupon applied successfully",
        data: {
          couponCode: coupon.code,
          originalPrice: price,
          discountAmount: Math.round(discountAmount * 100) / 100,
          finalPrice: Math.round(finalPrice * 100) / 100,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
        },
        statusCode: 200,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Coupon Validation Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/dashboard/coupon?slug=course-slug
 * Lists all available coupons for a specific course.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const courseSlug = searchParams.get("slug");

    if (!courseSlug) {
      return NextResponse.json(
        { success: false, message: "Course slug is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const course = await Course.findOne({ slug: courseSlug, isActive: true });
    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    // Find mappings for this course
    const mappings = await CourseCouponMap.find({
      courseId: course._id,
      isActive: true,
    }).populate("couponId");

    const now = new Date();
    
    // Filter valid coupons
    const availableCoupons = mappings
      .map((m: any) => m.couponId)
      .filter((c: any) => {
        if (!c || !c.isActive) return false;
        if (new Date(c.validFrom) > now) return false;
        if (c.validTo && new Date(c.validTo) < now) return false;
        return true;
      })
      .map((c: any) => ({
        code: c.code,
        description: `Get ${c.discountType === "FLAT" ? "₹" : ""}${c.discountValue}${c.discountType === "PERCENT" ? "%" : ""} OFF`,
        minOrderAmount: c.minOrderAmount,
        validTo: c.validTo,
      }));

    return NextResponse.json({
      success: true,
      data: availableCoupons,
    });
  } catch (error) {
    console.error("Fetch Coupons Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
