// src/models/dto/syllabus.mapper.ts

import { mapBaseFields } from "./base.mapper";

export const mapSyllabus = (doc: any) => ({
  ...mapBaseFields(doc),
  examId: doc.examId?.toString(),
  courseId: doc.courseId?.toString(),
  academicYear: doc.academicYear,
  isActive: doc.isActive,
});
