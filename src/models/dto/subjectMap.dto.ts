// src/models/dto/subjectMap.dto.ts

import { BaseDTO } from "./base.dto";

export interface SubjectMapDTO extends BaseDTO {
  syllabusId: string;
  subjectId: string;
  order: number;
  isOptional: boolean;
  isRemoved: boolean;
  validFrom: number;
  validTo: number | null;
}
