/**
 * src/models/dto/examSidebar.dto.ts
 */

export interface ExamSidebarServerDto {
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
