// models/Chapter.ts
import { BaseEntity } from "./BaseEntity";

export interface Chapter extends BaseEntity {
  subjectId: string;

  chapterNumber: number;
  name: string;

  order: number;

  isActive: boolean;
}
