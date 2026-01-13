// src/services/chapter.service.ts

import Chapter from "@/models/mongoose/Chapter.schema";
import { mapChapter } from "@/models/dto/chapter.mapper";
import { notDeleted, toObjectId } from "./helpers";

export async function createChapter(payload: any, updatedBy?: string) {
  const doc = await Chapter.create({ ...payload, updatedBy });
  return mapChapter(doc);
}

export async function listChapters(subjectId: string) {
  const docs = await Chapter.find({
    subjectId: toObjectId(subjectId),
    ...notDeleted,
  }).sort({ order: 1 });

  return docs.map(mapChapter);
}
