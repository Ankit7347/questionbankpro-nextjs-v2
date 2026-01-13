// src/services/subject.service.ts

import Subject from "@/models/mongoose/Subject.schema";
import { mapSubject } from "@/models/dto/subject.mapper";
import { notDeleted, toObjectId } from "./helpers";

export async function createSubject(payload: any, updatedBy?: string) {
  const doc = await Subject.create({ ...payload, updatedBy });
  return mapSubject(doc);
}

export async function listSubjects(syllabusId: string) {
  const docs = await Subject.find({
    syllabusId: toObjectId(syllabusId),
    ...notDeleted,
  }).sort({ order: 1 });

  return docs.map(mapSubject);
}
