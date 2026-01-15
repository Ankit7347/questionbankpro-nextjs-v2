/**
 * src/models/dto/examSidebar.dto.ts
 */

import { BaseDTO } from "./base.dto";

export interface ExamSidebarServerDto {
  exam: ({
    slug: string;
    name: string;
  } & BaseDTO) | null;

  course: ({
    slug: string;
    name: string;
  } & BaseDTO) | null;

  syllabus: ({
    validFrom: number;
    validTo: number | null;
    isActive: boolean;
  } & BaseDTO) | null;

  subjects: ({
    slug: string;
    name: string;
    order: number;
    chapters: {
      slug: string;
      name: string;
      order: number;
    }[];
  } & BaseDTO)[];

  lang: string;
}
