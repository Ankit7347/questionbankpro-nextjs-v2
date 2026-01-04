// src/models/dto/exam.mapper.ts

import { mapBaseFields } from "./base.mapper";

export const mapExam = (doc: any) => ({
  ...mapBaseFields(doc),
  name: doc.name,
  examType: doc.examType,
  conductedBy: doc.conductedBy,
  isActive: doc.isActive,
});
