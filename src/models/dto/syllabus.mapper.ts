// src/models/dto/syllabus.dto.ts

import { BaseDTO } from "./base.dto";
import { mapBaseFields } from "./base.mapper";

export interface SyllabusDTO extends BaseDTO {
  courseId: string;
  validFrom: number;
  validTo: number | null;
}

export function mapSyllabus(doc: any): SyllabusDTO {
  return {
    ...mapBaseFields(doc),
    courseId: doc.courseId.toString(),
    validFrom: doc.validFrom,
    validTo: doc.validTo,
  };
}
