/**
 * src/dto/examSidebar.ui.dto.ts
 */

export interface ExamSidebarDto {
  exam: {
    slug: string;
    name: string;
  };
  course: {
    slug: string;
    name: string;
  };
  subjects: {
    slug: string;
    name: string;
    chapters: {
      slug: string;
      name: string;
    }[];
  }[];
}
