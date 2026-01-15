// src/models/dto/chapterMap.dto.ts

import { BaseDTO } from "./base.dto";

export interface ChapterMapDTO extends BaseDTO {
  subjectMapId: string;
  chapterId: string;
  order: number;
  isOptional: boolean;
  isRemoved: boolean;
  validFrom: number;
  validTo: number | null;
}
