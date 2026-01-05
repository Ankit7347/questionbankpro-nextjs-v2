// src/services/user.service.ts

import User from "@/models/mongoose/User.schema";
import { mapUser } from "@/models/dto/user.mapper";
import { notDeleted, toObjectId } from "./helpers";

export async function getUserByEmail(email: string) {
  const doc = await User.findOne({
    email,
    ...notDeleted,
  });
  return doc ? mapUser(doc) : null;
}

export async function createUser(payload: any) {
  const doc = await User.create(payload);
  return mapUser(doc);
}
