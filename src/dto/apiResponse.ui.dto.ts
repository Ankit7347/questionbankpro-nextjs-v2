// src/dto/apiResponse.ui.dto.ts

/**
 * Frontend-safe API Response
 * Used by client services, pages, components
 */

export interface ApiResponseUI<T = null> {
  success: boolean;
  data: T | null;
  error: string | null;
  statusCode: number;
}
