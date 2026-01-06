// src/models/dto/exam.dto.ts

import { BaseDTO } from "./base.dto";

export interface CourseButtonDTO extends BaseDTO {
  name: string;
  slug: string;
}

export interface ExamCardDTO extends BaseDTO {
  examName: string;
  examSlug: string;
  courses: CourseButtonDTO[];
}

export interface ExamLandingDTO extends BaseDTO {
  examName: string;
  courses: CourseButtonDTO[];
}
