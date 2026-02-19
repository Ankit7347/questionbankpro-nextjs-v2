// src/models/dto/topic.mapper.ts

import { BaseDTO } from "./base.dto";
import { mapBaseFields } from "./base.mapper";
import { resolveI18nField } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

export interface TopicDTO extends BaseDTO {
  name: string;
  slug: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
}

export function mapTopic(doc: any, lang: Lang = "en"): TopicDTO {
  return {
    ...mapBaseFields(doc),
    name: resolveI18nField(doc.name, lang),
    slug: doc.slug,
    description: resolveI18nField(doc.description, lang) ?? "",
    difficulty: doc.difficulty ?? "medium",
  };
}
