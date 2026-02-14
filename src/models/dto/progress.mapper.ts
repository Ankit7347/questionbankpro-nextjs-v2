// src/models/dto/progress.mapper.ts
import { mapBaseFields } from "./base.mapper";
import { ProgressDTO } from "./progress.dto";

export const mapProgress = (doc: any): ProgressDTO => {
  if (!doc) return {} as ProgressDTO;
  return {
    ...mapBaseFields(doc),
    userId: doc.userId,
    subjectId: doc.subjectId,
    chapterId: doc.chapterId,
    topicId: doc.topicId,
    progress: doc.progress,
    lastAccessed: doc.lastAccessed?.toISOString(),
  };
};
