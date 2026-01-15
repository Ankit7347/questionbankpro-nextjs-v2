// src/models/dto/chapter.mapper.ts

import { BaseDTO } from "./base.dto";
import { mapBaseFields } from "./base.mapper";

export interface ChapterDTO extends BaseDTO {
  name: string;
  slug: string;
  description: string;
}

export function mapChapter(doc: any): ChapterDTO {
  return {
    ...mapBaseFields(doc),
    name: doc.name,
    slug: doc.slug,
    description: doc.description ?? "",
  };
}
