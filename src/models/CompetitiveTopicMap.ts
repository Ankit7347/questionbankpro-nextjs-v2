// models/CompetitiveTopicMap.ts
import { BaseEntity } from "./BaseEntity";

export interface CompetitiveTopicMap extends BaseEntity {
  examId: string;
  topicId: string;

  weightage?: number;
  priority?: "low" | "medium" | "high";
}
