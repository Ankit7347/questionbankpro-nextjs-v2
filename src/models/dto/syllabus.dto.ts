// src/models/dto/syllabus.dto.ts

import { BaseDTO } from "./base.dto";

export interface SyllabusDTO extends BaseDTO {
  courseId: string;
  year: number;
  version: number;
  validFrom: number;
  validTo: number | null;
  isActive: boolean;
}
