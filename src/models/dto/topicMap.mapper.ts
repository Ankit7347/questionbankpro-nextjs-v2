// src/models/dto/topicMap.mapper.ts

import { BaseDTO } from "./base.dto";
import { mapBaseFields } from "./base.mapper";

export interface TopicMapDTO extends BaseDTO {
  chapterMapId: string;
  topicId: string;
  order: number;
  isOptional: boolean;
  isRemoved: boolean;
  validFrom: number;
  validTo: number | null;
}

export function mapTopicMap(doc: any): TopicMapDTO {
  return {
    ...mapBaseFields(doc),
    chapterMapId: doc.chapterMapId.toString(),
    topicId: doc.topicId.toString(),
    order: doc.order,
    isOptional: doc.isOptional ?? false,
    isRemoved: doc.isRemoved ?? false,
    validFrom: doc.validFrom,
    validTo: doc.validTo,
  };
}
