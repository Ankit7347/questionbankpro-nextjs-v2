// src/models/dto/exam.dto.ts

import { BaseDTO } from "./base.dto";

/**
 * SubExam shown under an Exam
 */
export interface SubExamDTO extends BaseDTO {
  id: string;
  name: string;
  slug: string;
}

/**
 * Unified Exam UI
 * Used for:
 * - Exam Landing
 * - Exam Catalog
 */
export interface ExamdDTO extends BaseDTO {
  id: string;
  examName: string;
  examSlug: string;
  subExams: SubExamDTO[];
}
