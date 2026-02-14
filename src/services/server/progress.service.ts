// src/services/server/progress.service.ts

import Progress from "@/models/mongoose/Progress.schema";
import { mapProgress } from "@/models/dto/progress.mapper";
import { notDeleted } from "./helpers";

export async function upsertProgress(
  userId: string,
  fields: Partial<{ subjectId: string; chapterId: string; topicId: string; progress: number; }>
) {
  const filter: any = { userId, ...notDeleted };
  if (fields.subjectId) filter.subjectId = fields.subjectId;
  if (fields.chapterId) filter.chapterId = fields.chapterId;
  if (fields.topicId) filter.topicId = fields.topicId;

  const update = {
    ...fields,
    lastAccessed: new Date(),
  };

  const doc = await Progress.findOneAndUpdate(filter, update, {
    upsert: true,
    new: true,
  });
  return mapProgress(doc);
}

export async function getProgress(userId: string, query: any = {}) {
  const docs = await Progress.find({ userId, ...notDeleted, ...query }).lean();
  return docs.map(mapProgress);
}
