// src/app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { executeRegistration } from "@/services/server/register.server";

/**
 * Register API
 * =============
 * This route validates the registration payload coming from RegisterPage.
 * Validation MUST stay in sync with:
 * - RegisterFormData (UI DTO)
 * - User.schema.ts (DB schema)
 *
 * NOTE:
 * - `competition` has been REMOVED from schema and UI
 * - `educationLevel` drives UG / PG / School logic
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    /* =========================
       1. REQUIRED FIELD CHECK
       (Schema-aligned)
    ========================== */
    const requiredFields: string[] = [
      // basic
      "name",
      "email",
      "phone",
      "password",

      // location
      "geolocationStateId",
      "geolocationDistrictId",
      "stateName",
      "districtName",

      // education
      "educationLevel",
      "examType",
      "className",
      "courseName",

      // sub-exam
      "subExamId",
      "subExamSlug",
    ];

    for (const field of requiredFields) {
      if (
        body[field] === undefined ||
        body[field] === null ||
        body[field].toString().trim() === ""
      ) {
        return NextResponse.json(
          {
            success: false,
            data: null,
            error: `${field} is required`,
            statusCode: 400,
          },
          { status: 400 }
        );
      }
    }

    /* =========================
       2. ENUM / VALUE VALIDATION
    ========================== */

    // educationLevel validation
    if (!["school", "ug", "pg"].includes(body.educationLevel)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Invalid educationLevel",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    // examType validation
    if (!["school", "program", "competitive"].includes(body.examType)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Invalid examType",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    /* =========================
       3. CONSISTENCY CHECKS
       (Defensive, not UI logic)
    ========================== */

    // School consistency
    if (body.examType === "school" && body.educationLevel !== "school") {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "educationLevel must be 'school' for school examType",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    // Program consistency
    if (
      body.examType === "program" &&
      !["ug", "pg"].includes(body.educationLevel)
    ) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "educationLevel must be 'ug' or 'pg' for program examType",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    /* =========================
       4. CALL DOMAIN SERVICE
    ========================== */
    const data = await executeRegistration(body);

    /* =========================
       5. SUCCESS RESPONSE
    ========================== */
    return NextResponse.json(
      {
        success: true,
        data,
        error: null,
        statusCode: 201,
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("API Register Error:", error);

    const isConflict =
      typeof error?.message === "string" &&
      error.message.toLowerCase().includes("exists");

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
