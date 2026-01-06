// src/services/educationLevel.service.ts

import EducationLevel from "@/models/mongoose/EducationLevel.schema";
import { mapEducationLevel } from "@/models/dto/educationLevel.mapper";
import { notDeleted, toObjectId } from "./helpers";

export async function createEducationLevel(
  payload: any,
  updatedBy?: string
) {
  const doc = await EducationLevel.create({
    ...payload,
    updatedBy,
  });
  return mapEducationLevel(doc);
}

export async function listEducationLevels() {
  const docs = await EducationLevel.find(notDeleted).sort({
    order: 1,
  });
  return docs.map(mapEducationLevel);
}

export async function updateEducationLevel(
  id: string,
  payload: any,
  updatedBy?: string
) {
  const doc = await EducationLevel.findOneAndUpdate(
    { _id: toObjectId(id), ...notDeleted },
    { $set: { ...payload, updatedBy } },
    { new: true }
  );
  return doc ? mapEducationLevel(doc) : null;
}

export async function deleteEducationLevel(
  id: string,
  updatedBy?: string
) {
  await EducationLevel.updateOne(
    { _id: toObjectId(id) },
    { $set: { isDeleted: true, updatedBy } }
  );
}
