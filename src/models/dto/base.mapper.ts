// src/models/dto/base.mapper.ts

import { Types } from "mongoose";

export interface BaseDTO {
  id: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  updatedBy?: string;
}

export function mapBaseFields(doc: {
  _id: Types.ObjectId | string;
  isDeleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
  updatedBy?: string;
}): BaseDTO {
  return {
    id:
      doc._id instanceof Types.ObjectId
        ? doc._id.toString()
        : String(doc._id),

    isDeleted: doc.isDeleted ?? false,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    updatedBy: doc.updatedBy,
  };
}
