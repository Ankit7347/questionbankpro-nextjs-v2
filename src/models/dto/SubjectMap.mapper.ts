// src/models/dto/subjectMap.mapper.ts

import { BaseDTO } from "./base.dto";
import { mapBaseFields } from "./base.mapper";

export interface SubjectMapDTO extends BaseDTO {
  syllabusId: string;
  subjectId: string;
  order: number;
  isOptional: boolean;
  isRemoved: boolean;
  validFrom: number;
  validTo: number | null;
}

export function mapSubjectMap(doc: any): SubjectMapDTO {
  return {
    ...mapBaseFields(doc),
    syllabusId: doc.syllabusId.toString(),
    subjectId: doc.subjectId.toString(),
    order: doc.order,
    isOptional: doc.isOptional ?? false,
    isRemoved: doc.isRemoved ?? false,
    validFrom: doc.validFrom,
    validTo: doc.validTo,
  };
}
