// src/app/api/location/route.ts

import { NextResponse, NextRequest } from "next/server";
import { getStateList, getDistrictListByStateId } from "@/services/server/location.server";

/**
 * GET: Fetches all available states.
 * Returns an array of state objects with 'id' and 'stateName'.
 */
export async function GET() {
  try {
    const data = await getStateList();
    return NextResponse.json({
      success: true,
      data,
      statusCode: 200,
    });
  } catch (err) {
    console.error("GET_LOCATION_ERROR:", err);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch states",
      statusCode: 500,
    }, { status: 500 });
  }
}

/**
 * POST: Fetches districts belonging to a specific state.
 * Expects: { stateId: string } in the request body.
 * Note: Uses stateId (mapped from _id) to query the database.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { stateId } = body;

    if (!stateId) {
      return NextResponse.json({
        success: false,
        message: "stateId is required",
        statusCode: 400,
      }, { status: 400 });
    }

    const data = await getDistrictListByStateId(stateId);
    
    return NextResponse.json({
      success: true,
      data,
      statusCode: 200,
    });
  } catch (err) {
    console.error("POST_LOCATION_ERROR:", err);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch districts",
      statusCode: 500,
    }, { status: 500 });
  }
}