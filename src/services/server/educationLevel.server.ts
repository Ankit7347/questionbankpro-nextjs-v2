// src/services/educationLevel.service.ts

import { EducationLevelModel } from "@/models/mongoose/EducationLevel.schema";
import { mapEducationLevel } from "@/models/dto/educationLevel.mapper";
import { notDeleted, toObjectId } from "./helpers";

export async function createEducationLevel(
  payload: any,
  updatedBy?: string
) {
  const doc = await EducationLevelModel.create({
    ...payload,
    updatedBy,
  });
  return mapEducationLevel(doc);
}

export async function listEducationLevels() {
  const docs = await EducationLevelModel.find(notDeleted).sort({
    order: 1,
  });
  return docs.map(mapEducationLevel);
}

export async function updateEducationLevel(
  id: string,
  payload: any,
  updatedBy?: string
) {
  const doc = await EducationLevelModel.findOneAndUpdate(
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
  await EducationLevelModel.updateOne(
    { _id: toObjectId(id) },
    { $set: { isDeleted: true, updatedBy } }
  );
}
