// src/models/dto/apiResponse.dto.ts

/**
 * Standard API Response DTO
 * Used by all API routes
 */

export interface ApiResponse<T = null> {
  success: boolean;
  data: T | null;
  error: string | null;
  statusCode: number;
}

export function successResponse<T>(
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

export function errorResponse(
  error: string,
  statusCode = 400
): ApiResponse<null> {
  return {
    success: false,
    data: null,
    error,
    statusCode,
  };
}
