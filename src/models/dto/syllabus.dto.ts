// src/models/dto/syllabus.dto.ts

import { BaseDTO } from "./base.dto";

export interface SyllabusDTO extends BaseDTO {
  courseId: string;
  validFrom: number;
  validTo: number | null;
}
