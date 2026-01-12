// src/models/dto/exam.dto.ts

import { BaseDTO } from "./base.dto";

/**
 * Used ONLY for /api/exams/landing
 */
export interface CourseLandingDTO extends BaseDTO {
  name: string;
  slug: string;
}

export interface ExamLandingDTO extends BaseDTO {
  examName: string;
  examSlug: string;
  courses: CourseLandingDTO[];
}
export interface ExamCardDTO extends BaseDTO {
  examName: string;
  examSlug: string;
  courses: CourseLandingDTO[];
}
