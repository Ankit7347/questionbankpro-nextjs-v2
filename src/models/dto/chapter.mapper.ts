// src/models/dto/chapter.mapper.ts

import { BaseDTO } from "./base.dto";
import { mapBaseFields } from "./base.mapper";
import { resolveI18nField } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

export interface ChapterDTO extends BaseDTO {
  name: string;
  slug: string;
  description: string;
}

export function mapChapter(doc: any, lang: Lang = "en"): ChapterDTO {
  return {
    ...mapBaseFields(doc),
    name: resolveI18nField(doc.name, lang),
    slug: doc.slug,
    description: resolveI18nField(doc.description, lang) ?? "",
  };
}
