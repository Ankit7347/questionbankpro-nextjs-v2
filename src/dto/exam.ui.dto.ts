// src/dto/exam.ui.dto.ts

/**
 * SubExam shown under an Exam
 */
export interface SubExamUI {
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
export interface ExamUI {
  id: string;
  examName: string;
  examSlug: string;
  subExams: SubExamUI[];
}

/**
 * Education level grouping (Catalog view)
 */
export interface EducationLevelGroupUI {
  educationLevelId: string;
  educationLevelName: string;
  educationLevelDescription?: string;
  exams: ExamUI[];
}
