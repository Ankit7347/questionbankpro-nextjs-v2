// src/services/syllabus.service.ts

import { SyllabusModel } from "@/models/mongoose/Syllabus.schema";
import { mapSyllabus } from "@/models/dto/syllabus.mapper";
import { notDeleted, toObjectId } from "./helpers";

export async function createSyllabus(payload: any, updatedBy?: string) {
  const doc = await SyllabusModel.create({ ...payload, updatedBy });
  return mapSyllabus(doc);
}

export async function listSyllabusByCourse(courseId: string) {
  const docs = await SyllabusModel.find({
    courseId: toObjectId(courseId),
    ...notDeleted,
  });
  return docs.map(mapSyllabus);
}
