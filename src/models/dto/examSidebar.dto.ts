/**
 * src/models/dto/examSidebar.dto.ts
 */

import { BaseDTO } from "./base.dto";

export interface ExamSidebarServerDto {
  exam: {
    slug: string;
    name: string;
  } & BaseDTO;

  course: {
    slug: string;
    name: string;
  } & BaseDTO;

  syllabus: ({
    validFrom: number;
    validTo: number | null;
    isActive: boolean;
  } & BaseDTO) | null;

  subjects: ({
    slug: string;
    name: string;
    chapters: {
      slug: string;
      name: string;
    }[];
  } & BaseDTO)[];

  lang: string;
}
