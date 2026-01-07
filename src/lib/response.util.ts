// src/lib/response.util.ts

import { ApiResponse } from "@/models/dto/apiResponse.dto";
import { ApiError } from "./apiError";

/**
 * Success response creator
 */
export function ok<T>(
  data: T,
  statusCode = 200
): ApiResponse<T> {
  return {
    success: true,
    data,
    error: null,
    statusCode,
  };
}

/**
 * Error response creator
 */
export function fail(
  error: unknown
): ApiResponse<null> {
  if (error instanceof ApiError) {
    return {
      success: false,
      data: null,
      error: error.message,
      statusCode: error.statusCode,
    };
  }

  return {
    success: false,
    data: null,
    error: "Internal server error",
    statusCode: 500,
  };
}
