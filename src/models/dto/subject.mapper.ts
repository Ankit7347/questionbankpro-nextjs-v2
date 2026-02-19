// src/models/dto/subject.mapper.ts

import { BaseDTO } from "./base.dto";
import { mapBaseFields } from "./base.mapper";
import { resolveI18nField } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

export interface SubjectDTO extends BaseDTO {
  name: string;
  slug: string;
  description: string;
}

export function mapSubject(doc: any, lang: Lang = "en"): SubjectDTO {
  return {
    ...mapBaseFields(doc),
    name: resolveI18nField(doc.name, lang),
    slug: doc.slug,
    description: resolveI18nField(doc.description, lang) ?? "",
  };
}
