// src/models/dto/chapter.dto.ts

import { BaseDTO } from "./base.dto";

export interface ChapterDTO extends BaseDTO {
  subjectId: string;
  name: string;
  slug: string;
  order: number;
  validFrom: number;
  validTo: number | null;
}
