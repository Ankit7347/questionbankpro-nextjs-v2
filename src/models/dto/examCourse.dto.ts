// src/models/dto/examCourse.dto.ts

import { BaseDTO } from "./base.dto";

export interface ExamCourseOverviewDTO {
  exam: {
    name: string;
    slug: string;
  } & BaseDTO;
  subExam: {
    name: string;
    slug: string;
  } & BaseDTO;
  subjects: Array<{
    name: string;
    slug: string;
  } & BaseDTO>;
}