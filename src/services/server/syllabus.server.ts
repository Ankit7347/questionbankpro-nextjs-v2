// src/services/syllabus.service.ts

import Syllabus from "@/models/mongoose/Syllabus.schema";
import { mapSyllabus } from "@/models/dto/syllabus.mapper";
import { notDeleted, toObjectId } from "./helpers";

export async function createSyllabus(payload: any, updatedBy?: string) {
  const doc = await Syllabus.create({ ...payload, updatedBy });
  return mapSyllabus(doc);
}

export async function listSyllabusByCourse(courseId: string) {
  const docs = await Syllabus.find({
    courseId: toObjectId(courseId),
    ...notDeleted,
  });
  return docs.map(mapSyllabus);
}
