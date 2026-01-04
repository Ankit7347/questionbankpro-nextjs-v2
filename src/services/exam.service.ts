// src/services/exam.service.ts

import { ExamModel } from "@/models/mongoose/Exam.schema";
import { mapExam } from "@/models/dto/exam.mapper";
import { notDeleted, toObjectId } from "./helpers";

export async function createExam(payload: any, updatedBy?: string) {
  const doc = await ExamModel.create({ ...payload, updatedBy });
  return mapExam(doc);
}

export async function listExams() {
  const docs = await ExamModel.find(notDeleted);
  return docs.map(mapExam);
}

export async function updateExam(
  id: string,
  payload: any,
  updatedBy?: string
) {
  const doc = await ExamModel.findOneAndUpdate(
    { _id: toObjectId(id), ...notDeleted },
    { $set: { ...payload, updatedBy } },
    { new: true }
  );
  return doc ? mapExam(doc) : null;
}
