// src/lib/apiError.ts

/**
 * Central API Error class
 * Thrown inside server services only
 */

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode = 400,
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export const BadRequest = (message: string) =>
  new ApiError(message, 400);

export const Unauthorized = (message = "Unauthorized") =>
  new ApiError(message, 401);

export const Forbidden = (message = "Forbidden") =>
  new ApiError(message, 403);

export const NotFound = (message: string) =>
  new ApiError(message, 404);

export const InternalError = (message = "Internal server error") =>
  new ApiError(message, 500, false);
