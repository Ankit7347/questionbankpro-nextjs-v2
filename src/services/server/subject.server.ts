// src/services/subject.service.ts

import dbConnect from "@/lib/mongodb";
import Subject from "@/models/mongoose/Subject.schema";
import { mapSubject } from "@/models/dto/subject.mapper";
import { getCurrentLang } from "@/lib/i18n";
import { notDeleted, toObjectId } from "./helpers";

export async function createSubject(payload: any, updatedBy?: string) {
  await dbConnect();
  const lang = getCurrentLang();
  const doc = await Subject.create({ ...payload, updatedBy });
  return mapSubject(doc, lang);
}

export async function listSubjects(syllabusId: string) {
  await dbConnect();
  const lang = getCurrentLang();
  const docs = await Subject.find({
    syllabusId: toObjectId(syllabusId),
    ...notDeleted,
  }).sort({ order: 1 });

  return docs.map((doc) => mapSubject(doc, lang));
}
