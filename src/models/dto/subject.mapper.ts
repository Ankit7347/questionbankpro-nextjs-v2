// src/models/dto/subject.mapper.ts

import { mapBaseFields } from "./base.mapper";

export const mapSubject = (doc: any) => ({
  ...mapBaseFields(doc),
  syllabusId: doc.syllabusId?.toString(),
  name: doc.name,
  code: doc.code,
  order: doc.order,
  isActive: doc.isActive,
});
