// src/app/dto/syllabus.ui.dto.ts
/**
 * UI DTO – Syllabus Structure (READ ONLY)
 * Owned by backend, consumed by UI
 * Updated to support multiple subjects
 */

export interface SyllabusDTO {
  exam: {
    title: string;
  };

  subExam: {
    title: string;
  };

  // Changed from a single "subject" object to a "subjects" array
  subjects: {
    title: string;
    slug: string;
    chapters: {
      id: string;
      title: string;
      slug: string;
      topics: {
        id: string;
        title: string;
        url: string; // 👈 backend-provided absolute URL
      }[];
    }[];
  }[];
}