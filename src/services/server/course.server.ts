// src/services/course.service.ts

import Course from "@/models/mongoose/Course.schema";
import { mapCourse } from "@/models/dto/course.mapper";
import { notDeleted, toObjectId } from "./helpers";

export async function createCourse(payload: any, updatedBy?: string) {
  const doc = await Course.create({ ...payload, updatedBy });
  return mapCourse(doc);
}

export async function listCoursesByLevel(educationLevelId: string) {
  const docs = await Course.find({
    educationLevelId: toObjectId(educationLevelId),
    ...notDeleted,
  });
  return docs.map(mapCourse);
}

export async function deleteCourse(id: string, updatedBy?: string) {
  await Course.updateOne(
    { _id: toObjectId(id) },
    { $set: { isDeleted: true, updatedBy } }
  );
}
