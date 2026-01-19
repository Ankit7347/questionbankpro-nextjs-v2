/**
 * src/dto/examSidebar.ui.dto.ts
 */

export interface ExamSidebarDto {
  exam: {
    slug: string;
    name: string;
  } | null;

  subExam: {
    slug: string;
    name: string;
  } | null;

  subjects: {
    slug: string;
    name: string;
    order: number;
    chapters: {
      slug: string;
      name: string;
      order: number;
    }[];
  }[];
}
