// src/types/exam.ts

export interface CourseCard {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  badge?: string;
}

export interface ExamCard {
  id: string;
  examName: string;
  examSlug: string;
  shortName?: string;
  icon?: string;
  description?: string;
  courses: CourseCard[];
}

export interface EducationLevelGroup {
  educationLevelId: string;
  educationLevelName: string;
  educationLevelIcon?: string;
  educationLevelDescription?: string;
  exams: ExamCard[];
}

