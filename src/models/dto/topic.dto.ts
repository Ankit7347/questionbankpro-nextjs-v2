// src/models/dto/topic.dto.ts

import { BaseDTO } from "./base.dto";
import { mapBaseFields } from "./base.mapper";

export interface TopicDTO extends BaseDTO {
  chapterId: string;
  name: string;
  slug: string;
  order: number;

  difficulty: "easy" | "medium" | "hard";
  isCoreTopic: boolean;

  validFrom: number;
  validTo: number | null;
}

export function mapTopic(doc: any): TopicDTO {
  return {
    ...mapBaseFields(doc),
    chapterId: doc.chapterId.toString(),
    name: doc.name,
    slug: doc.slug,
    order: doc.order,

    difficulty: doc.difficulty,
    isCoreTopic: doc.isCoreTopic,

    validFrom: doc.validFrom,
    validTo: doc.validTo,
  };
}
