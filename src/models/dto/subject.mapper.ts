// src/models/dto/subject.mapper.ts

import { BaseDTO } from "./base.dto";
import { mapBaseFields } from "./base.mapper";

export interface SubjectDTO extends BaseDTO {
  name: string;
  slug: string;
  description: string;
}

export function mapSubject(doc: any): SubjectDTO {
  return {
    ...mapBaseFields(doc),
    name: doc.name,
    slug: doc.slug,
    description: doc.description ?? "",
  };
}
