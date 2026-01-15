// src/models/dto/chapter.dto.ts

import { BaseDTO } from "./base.dto";

export interface ChapterDTO extends BaseDTO {
  name: string;
  slug: string;
  description: string;
}
