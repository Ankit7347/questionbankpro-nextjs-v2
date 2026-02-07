// src/services/client/syllabus.client.ts
/**
 * Syllabus Client Service
 * ======================
 *
 * Pattern reference:
 * - src/services/client/course.client.ts
 *
 * Responsibility:
 * - Client-side gateway for dashboard syllabus API
 *
 * Rules:
 * - NO business logic
 * - NO UI DTOs
 * - Uses syllabus-domain DTOs only
 */

import { ApiResponseUI } from "@/dto/apiResponse.ui.dto"
import { SyllabusSubjectDTO } from "@/models/dto/syllabusSubject.dto"

/**
 * Dashboard → Syllabus
 *
 * ONE API call
 * Server resolves:
 * - session.user.subExamId
 * - OfficialSyllabus
 * - SubjectMap
 */
export async function fetchDashboardSyllabus(): Promise<
  ApiResponseUI<SyllabusSubjectDTO[]>
> {
  try {
    const res = await fetch("/api/dashboard/syllabus")

    if (!res.ok) {
      return {
        success: false,
        data: null,
        error: "Failed to fetch dashboard syllabus",
        statusCode: res.status,
      }
    }

    return await res.json()
  } catch {
    return {
      success: false,
      data: null,
      error: "Network error occurred",
      statusCode: 500,
    }
  }
}
