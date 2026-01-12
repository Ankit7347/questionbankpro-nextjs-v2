// src/dto/examLanding.ui.dto.ts

export interface CourseLandingUI {
  id: string;
  name: string;
  slug: string;
}

export interface ExamLandingUI {
  id: string;
  examName: string;
  examSlug: string;
  courses: CourseLandingUI[];
}
