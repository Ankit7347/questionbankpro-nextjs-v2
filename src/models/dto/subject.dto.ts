// src/models/dto/subject.dto.ts

import { BaseDTO } from "./base.dto";

export interface SubjectDTO extends BaseDTO {
  syllabusId: string;
  name: string;
  slug: string;
  order: number;
  validFrom: number;
  validTo: number | null;
}
