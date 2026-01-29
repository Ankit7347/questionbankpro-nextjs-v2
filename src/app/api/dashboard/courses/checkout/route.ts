// src/app/api/dashboard/courses/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import UserCourseAccess from "@/models/mongoose/UserCourseAccess.schema";
import User from "@/models/mongoose/User.schema"; // Import your User model
import { Types } from "mongoose";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    // 1. Session Check
    if (!session?.user?.id) {
      return NextResponse.json({ 
        success: false, 
        message: "Unauthorized: Please login to continue",
        statusCode: 401 
      }, { status: 401 });
    }

    const body = await req.json();
    const { coupon, courseId } = body;

    // 2. Payload Validation
    if (!courseId) {
      return NextResponse.json({ 
        success: false, 
        message: "Course ID is missing",
        statusCode: 400 
      }, { status: 400 });
    }

    await dbConnect();

    // 3. User Existence Check
    // Verifying if the user from the session actually exists in our DB
    const userExists = await User.findOne({uuid:session.user.id});
    if (!userExists) {
      return NextResponse.json({ 
        success: false, 
        message: "User account not found in database",
        statusCode: 404 
      }, { status: 404 });
    }

    // 4. Price & Coupon Logic
    const isFree = coupon?.toUpperCase() === "FREE2026";
    const accessType = isFree ? "FREE" : "PAID";
    const pricePaid = isFree ? 0 : 1999;

    // 5. Create Access Record
    const access = await UserCourseAccess.create({
      userId: new Types.ObjectId(userExists._id), 
      courseId: new Types.ObjectId(courseId),
      subExamId: new Types.ObjectId(userExists.subExamId),
      accessType,
      pricePaid,
      status: "ACTIVE",
      enrolledAt: new Date(),
      accessValidTill: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    });

    return NextResponse.json({ 
      success: true, 
      message: "Enrollment successful",
      data: access,
      statusCode: 201
    }, { status: 201 });

  } catch (error: any) {
    // 6. Handle Unique Index Conflict (User already has this course)
    if (error.code === 11000) {
      return NextResponse.json({ 
        success: false, 
        message: "You already have access to this course",
        statusCode: 409 
      }, { status: 409 });
    }

    // 7. General Error Handling
    console.error("Checkout Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || "Internal Server Error",
      statusCode: 500 
    }, { status: 500 });
  }
}