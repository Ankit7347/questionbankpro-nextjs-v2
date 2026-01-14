// src/models/dto/subject.dto.ts

import { BaseDTO } from "./base.dto";
import { mapBaseFields } from "./base.mapper";

export interface SubjectDTO extends BaseDTO {
  syllabusId: string;
  name: string;
  slug: string;
  order: number;
  validFrom: number;
  validTo: number | null;
}

export function mapSubject(doc: any): SubjectDTO {
  return {
    ...mapBaseFields(doc),
    syllabusId: doc.syllabusId.toString(),
    name: doc.name,
    slug: doc.slug,
    order: doc.order,
    validFrom: doc.validFrom,
    validTo: doc.validTo,
  };
}
