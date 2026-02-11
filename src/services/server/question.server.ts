// src/services/question.service.ts

import Question from "@/models/mongoose/Question.schema";
import { mapQuestion } from "@/models/dto/question.mapper";
import { notDeleted, toObjectId } from "./helpers";

export async function createQuestion(payload: any, updatedBy?: string) {
  const doc = await Question.create({ ...payload, updatedBy });
  return mapQuestion(doc);
}

export async function listQuestionsByTopic(topicId: string) {
  const docs = await Question.find({
    topicId: toObjectId(topicId),
    ...notDeleted,
  });

  return docs.map(mapQuestion);
}
