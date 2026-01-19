// src/models/dto/examCourse.dto.ts

import { BaseDTO } from "./base.dto";

export interface SubjectDTO extends BaseDTO {
  name: string;
  slug: string;
}

export interface ExamCourseOverviewDTO {
  exam: {
    name: string;
    slug: string;
  };
  subExam: {
    name: string;
    slug: string;
  };
  subjects: SubjectDTO[];
}
