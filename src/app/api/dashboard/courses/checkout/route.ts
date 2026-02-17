// src/app/api/dashboard/courses/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import UserCourseAccess from "@/models/mongoose/UserCourseAccess.schema";
import User from "@/models/mongoose/User.schema";
import Course from "@/models/mongoose/Course.schema";
import Coupon from "@/models/mongoose/Coupon.schema";
import CourseCouponMap from "@/models/mongoose/CourseCouponMap.schema";
import { Types } from "mongoose";
import crypto from "crypto";
import { razorpay } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: Please login to continue",
          statusCode: 401,
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { coupon, slug } = body;
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = body;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Course slug is missing or invalid",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const userExists = await User.findOne({ uuid: session.user.id });
    if (!userExists) {
      return NextResponse.json(
        {
          success: false,
          message: "User account not found in database",
          statusCode: 404,
        },
        { status: 404 }
      );
    }
    // fetch course by slug (security: server validates the course)
    const course = await Course.findOne({ slug, isActive: true, isDeleted: false });
    if (!course) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or inactive course",
          statusCode: 404,
        },
        { status: 404 }
      );
    }

    // check if user already has access
    const existingAccess = await UserCourseAccess.findOne({
      userId: new Types.ObjectId(userExists._id),
      courseId: course._id,
    });
    if (existingAccess) {
      return NextResponse.json(
        {
          success: false,
          message: "You already have access to this course",
          statusCode: 409,
        },
        { status: 409 }
      );
    }

    //
    //  ---------------  Phase 1: Validate coupon & create order ---------------
    //
    if (!razorpayPaymentId) {
      let finalPrice = course.salePrice;
      let accessType = "PAID";
      let appliedCoupon: any = null;

      // if coupon is provided, validate it server-side
      if (coupon) {
        const couponDoc = await Coupon.findOne({
          code: coupon.toUpperCase(),
          isActive: true,
        });

        if (!couponDoc) {
          return NextResponse.json(
            {
              success: false,
              message: "Invalid coupon code",
              statusCode: 400,
            },
            { status: 400 }
          );
        }

        // validate coupon date range
        const now = new Date();
        if (new Date(couponDoc.validFrom) > now) {
          return NextResponse.json(
            {
              success: false,
              message: "Coupon is not yet active",
              statusCode: 400,
            },
            { status: 400 }
          );
        }
        if (couponDoc.validTo && new Date(couponDoc.validTo) < now) {
          return NextResponse.json(
            {
              success: false,
              message: "Coupon has expired",
              statusCode: 400,
            },
            { status: 400 }
          );
        }

        // validate course coupon mapping
        const mapping = await CourseCouponMap.findOne({
          courseId: course._id,
          couponId: couponDoc._id,
          isActive: true,
        });
        if (!mapping) {
          return NextResponse.json(
            {
              success: false,
              message: "This coupon is not applicable to this course",
              statusCode: 400,
            },
            { status: 400 }
          );
        }

        // calculate discount
        let discountAmount = 0;
        if (couponDoc.discountType === "FLAT") {
          discountAmount = couponDoc.discountValue;
        } else if (couponDoc.discountType === "PERCENT") {
          discountAmount = (course.salePrice * couponDoc.discountValue) / 100;
          if (couponDoc.maxDiscount && discountAmount > couponDoc.maxDiscount) {
            discountAmount = couponDoc.maxDiscount;
          }
        }

        finalPrice = Math.max(0, course.salePrice - discountAmount);
        accessType = finalPrice === 0 ? "FREE" : "PAID";
        appliedCoupon = couponDoc._id;
      }

      // if final price is 0 (free coupon), create access immediately
      if (finalPrice === 0) {
        const access = await UserCourseAccess.create({
          userId: new Types.ObjectId(userExists._id),
          courseId: course._id,
          subExamId: new Types.ObjectId(userExists.subExamId),
          couponId: appliedCoupon,
          accessType: "FREE",
          pricePaid: 0,
          status: "ACTIVE",
          enrolledAt: new Date(),
          accessValidTill: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          ),
        });

        return NextResponse.json({
          success: true,
          message: "Enrollment successful",
          data: access,
          statusCode: 201,
        }, { status: 201 });
      }

      // create razorpay order for paid course
      const amountInPaise = Math.round(finalPrice * 100);
      const shortReceipt = `${course._id.toString().slice(-10)}_${userExists._id.toString().slice(-10)}`;
      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: shortReceipt,
      });

      return NextResponse.json({ success: true, order });
    }

    //
    //  ---------------  Phase 2: verify & finalise ---------------
    //
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return NextResponse.json(
        { success: false, message: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // at this point payment is valid; create the access record
    const access = await UserCourseAccess.create({
      userId: new Types.ObjectId(userExists._id),
      courseId: course._id,
      subExamId: new Types.ObjectId(userExists.subExamId),
      accessType: "PAID",
      pricePaid: course.salePrice,
      status: "ACTIVE",
      enrolledAt: new Date(),
      accessValidTill: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ),
    });

    console.log("✅ Payment verified and access created:", {paymentId: razorpayPaymentId, userId: userExists._id, courseSlug: slug});

    return NextResponse.json({
      success: true,
      message: "Enrollment successful",
      data: access,
      statusCode: 201,
    }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "You already have access to this course",
          statusCode: 409,
        },
        { status: 409 }
      );
    }
    console.error("Checkout Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}