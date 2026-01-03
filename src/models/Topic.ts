// models/Topic.ts
import { BaseEntity } from "./BaseEntity";

export interface Topic extends BaseEntity {
  chapterId: string;

  name: string;

  difficulty?: "easy" | "medium" | "hard";
  isCoreTopic: boolean;
}
