// src/models/dto/chapterMap.mapper.ts

import { BaseDTO } from "./base.dto";
import { mapBaseFields } from "./base.mapper";

export interface ChapterMapDTO extends BaseDTO {
  subjectMapId: string;
  chapterId: string;
  order: number;
  isOptional: boolean;
  isRemoved: boolean;
  validFrom: number;
  validTo: number | null;
}

export function mapChapterMap(doc: any): ChapterMapDTO {
  return {
    ...mapBaseFields(doc),
    subjectMapId: doc.subjectMapId.toString(),
    chapterId: doc.chapterId.toString(),
    order: doc.order,
    isOptional: doc.isOptional ?? false,
    isRemoved: doc.isRemoved ?? false,
    validFrom: doc.validFrom,
    validTo: doc.validTo,
  };
}
