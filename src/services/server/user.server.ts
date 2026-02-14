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

export async function incrementBookmarkCount(userId: string, amount: number = 1) {
  const doc = await User.findOneAndUpdate(
    { uuid: userId, isDeleted: false },
    { $inc: { "dashboard.bookmarksCount": amount } },
    { new: true }
  ).lean();
  return doc ? mapUser(doc) : null;
}

export async function updateNotesSummary(userId: string, data: { total?: number; lastTopicId?: string }) {
  const update: any = {};
  if (data.total !== undefined) update["dashboard.notes.total"] = data.total;
  if (data.lastTopicId !== undefined) update["dashboard.notes.lastTopicId"] = data.lastTopicId;

  const doc = await User.findOneAndUpdate(
    { uuid: userId, isDeleted: false },
    { $set: update },
    { new: true }
  ).lean();
  return doc ? mapUser(doc) : null;
}
