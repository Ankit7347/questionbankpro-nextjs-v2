// src/models/dto/topic.dto.ts

import { BaseDTO } from "./base.dto";

export interface TopicDTO extends BaseDTO {
  name: string;
  slug: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
}
