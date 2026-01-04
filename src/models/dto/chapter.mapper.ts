// src/models/dto/chapter.mapper.ts

import { mapBaseFields } from "./base.mapper";

export const mapChapter = (doc: any) => ({
  ...mapBaseFields(doc),
  subjectId: doc.subjectId?.toString(),
  chapterNumber: doc.chapterNumber,
  name: doc.name,
  order: doc.order,
  isActive: doc.isActive,
});
