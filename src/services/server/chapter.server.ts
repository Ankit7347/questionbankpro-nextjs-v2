// src/services/chapter.service.ts

import dbConnect from "@/lib/mongodb";
import Chapter from "@/models/mongoose/Chapter.schema";
import { mapChapter } from "@/models/dto/chapter.mapper";
import { getCurrentLang } from "@/lib/i18n";
import { notDeleted, toObjectId } from "./helpers";

export async function createChapter(payload: any, updatedBy?: string) {
  await dbConnect();
  const lang = getCurrentLang();
  const doc = await Chapter.create({ ...payload, updatedBy });
  return mapChapter(doc, lang);
}

export async function listChapters(subjectId: string) {
  await dbConnect();
  const lang = getCurrentLang();
  const docs = await Chapter.find({
    subjectId: toObjectId(subjectId),
    ...notDeleted,
  }).sort({ order: 1 });

  return docs.map((doc) => mapChapter(doc, lang));
}
