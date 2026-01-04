// src/services/quiz.service.ts

import { QuizModel } from "@/models/mongoose/Quiz.schema";
import { mapQuiz } from "@/models/dto/quiz.mapper";
import { notDeleted, toObjectId } from "./helpers";

export async function createQuiz(payload: any, updatedBy?: string) {
  const doc = await QuizModel.create({ ...payload, updatedBy });
  return mapQuiz(doc);
}

export async function listQuizzesByEntity(entityId: string) {
  const docs = await QuizModel.find({
    linkedEntityId: toObjectId(entityId),
    ...notDeleted,
  });

  return docs.map(mapQuiz);
}
