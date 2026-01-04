// src/models/dto/course.mapper.ts

import { mapBaseFields } from "./base.mapper";

export const mapCourse = (doc: any) => ({
  ...mapBaseFields(doc),
  educationLevelId: doc.educationLevelId?.toString(),
  name: doc.name,
  stream: doc.stream,
  durationYears: doc.durationYears,
  isActive: doc.isActive,
});
