// src/models/dto/syllabus.mapper.ts

import { BaseDTO } from "./base.dto";
import { mapBaseFields } from "./base.mapper";

export interface SyllabusDTO extends BaseDTO {
  courseId: string;
  year: number;
  version: number;
  validFrom: number;
  validTo: number | null;
  isActive: boolean;
}

export function mapSyllabus(doc: any): SyllabusDTO {
  return {
    ...mapBaseFields(doc),
    courseId: doc.courseId.toString(),
    year: doc.year,
    version: doc.version,
    validFrom: doc.validFrom,
    validTo: doc.validTo,
    isActive: doc.isActive ?? false,
  };
}
