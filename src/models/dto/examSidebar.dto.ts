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

  syllabus: {
    year: number;
  };

  subjects: {
    slug: string;
    name: string;
    chapters: {
      slug: string;
      name: string;
    }[];
  }[];

  lang: string;
}
