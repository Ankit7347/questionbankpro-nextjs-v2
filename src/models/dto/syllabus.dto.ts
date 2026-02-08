// src/models/dto/syllabus.dto.ts

export interface SyllabusDTO {
  exam: { title: string };
  subExam: { title: string };
  subjects: {
    title: string;
    slug: string;
    chapters: {
      id: string;
      title: string;
      slug: string;
      topics: {
        id: string;
        title: string;
        url: string;
      }[];
    }[];
  }[];
}