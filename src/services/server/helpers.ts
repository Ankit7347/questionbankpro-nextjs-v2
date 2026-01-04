// src/services/helpers.ts
import { Types } from "mongoose";

export const notDeleted = { isDeleted: false };

export function toObjectId(id: string) {
  return new Types.ObjectId(id);
}
