// src/dto/examCatalog.ui.dto.ts

export interface CourseCatalogUI {
  id: string;
  name: string;
  slug: string;
}

export interface ExamCatalogUI {
  id: string;
  examName: string;
  examSlug: string;
  courses: CourseCatalogUI[];
}

export interface EducationLevelGroup {
  educationLevelId: string;
  educationLevelName: string;
  educationLevelDescription?: string;
  exams: ExamCatalogUI[];
}
