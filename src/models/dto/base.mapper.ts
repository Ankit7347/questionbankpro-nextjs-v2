// src/models/dto/base.mapper.ts
import { Types } from "mongoose";

export function mapBaseFields(doc: any) {
  return {
    id: doc._id instanceof Types.ObjectId
      ? doc._id.toString()
      : String(doc._id),

    isDeleted: doc.isDeleted ?? false,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    updatedBy: doc.updatedBy,
  };
}
