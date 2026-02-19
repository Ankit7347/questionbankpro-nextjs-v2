// src/services/topic.service.ts

import dbConnect from "@/lib/mongodb";
import Topic from "@/models/mongoose/Topic.schema";
import { mapTopic } from "@/models/dto/topic.mapper";
import { getCurrentLang } from "@/lib/i18n";
import { notDeleted, toObjectId } from "./helpers";

export async function createTopic(payload: any, updatedBy?: string) {
  await dbConnect();
  const lang = getCurrentLang();
  const doc = await Topic.create({ ...payload, updatedBy });
  return mapTopic(doc, lang);
}

export async function listTopics(chapterId: string) {
  await dbConnect();
  const lang = getCurrentLang();
  const docs = await Topic.find({
    chapterId: toObjectId(chapterId),
    ...notDeleted,
  });

  return docs.map((doc) => mapTopic(doc, lang));
}
