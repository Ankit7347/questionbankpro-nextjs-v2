// src/models/dto/topicMap.dto.ts

import { BaseDTO } from "./base.dto";

export interface TopicMapDTO extends BaseDTO {
  chapterMapId: string;
  topicId: string;
  order: number;
  isOptional: boolean;
  isRemoved: boolean;
  validFrom: number;
  validTo: number | null;
}
