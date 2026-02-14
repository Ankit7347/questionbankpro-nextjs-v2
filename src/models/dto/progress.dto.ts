// src/models/dto/progress.dto.ts
import { BaseDTO } from "./base.dto";

export interface ProgressDTO extends BaseDTO {
  userId: string;
  subjectId?: string;
  chapterId?: string;
  topicId?: string;
  progress: number;
  lastAccessed?: string;
}
