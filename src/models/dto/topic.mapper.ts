// src/models/dto/topic.mapper.ts

import { BaseDTO } from "./base.dto";
import { mapBaseFields } from "./base.mapper";

export interface TopicDTO extends BaseDTO {
  name: string;
  slug: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
}

export function mapTopic(doc: any): TopicDTO {
  return {
    ...mapBaseFields(doc),
    name: doc.name,
    slug: doc.slug,
    description: doc.description ?? "",
    difficulty: doc.difficulty ?? "medium",
  };
}
