// src/app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { executeRegistration } from "@/services/server/register.server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Mandatory fields check
    const requiredFields = [
      "name", "email", "phone", "stateName", 
      "districtName", "className", "competition", "password",
    ];

    for (const field of requiredFields) {
      if (!body[field] || body[field].toString().trim() === "") {
        return NextResponse.json(
          { success: false, data: null, error: `${field} is required`, statusCode: 400 },
          { status: 400 }
        );
      }
    }

    // 2. Conditional check for UG/PG
    if (["ug", "pg"].includes(body.className) && !body.courseName) {
      return NextResponse.json(
        { success: false, data: null, error: "courseName is required for UG/PG", statusCode: 400 },
        { status: 400 }
      );
    }

    // 3. Call the logic service
    const data = await executeRegistration(body);

    // 4. Standard Success Response
    return NextResponse.json({
      success: true,
      data,
      error: null,
      statusCode: 201,
    });

  } catch (error: any) {
    console.error("API Register Error:", error);

    // 5. Handle Conflicts (Email exists) vs Server Errors
    const isConflict = error.message.includes("exists");
    
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: error.message || "Internal Server Error",
        statusCode: isConflict ? 409 : 500,
      },
      { status: isConflict ? 409 : 500 }
    );
  }
}