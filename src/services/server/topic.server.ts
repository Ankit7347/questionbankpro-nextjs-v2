// src/services/topic.service.ts

import Topic from "@/models/mongoose/Topic.schema";
import { mapTopic } from "@/models/dto/topic.mapper";
import { notDeleted, toObjectId } from "./helpers";

export async function createTopic(payload: any, updatedBy?: string) {
  const doc = await Topic.create({ ...payload, updatedBy });
  return mapTopic(doc);
}

export async function listTopics(chapterId: string) {
  const docs = await Topic.find({
    chapterId: toObjectId(chapterId),
    ...notDeleted,
  });

  return docs.map(mapTopic);
}
