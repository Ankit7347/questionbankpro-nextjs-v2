// src/services/server/bookmark.service.ts

import Bookmark from "@/models/mongoose/Bookmark.schema";
import { mapBookmark } from "@/models/dto/bookmark.mapper";
import { notDeleted } from "./helpers";

import { incrementBookmarkCount } from "./user.server";

export async function addBookmark(userId: string, itemType: string, itemId: string) {
  const doc = await Bookmark.create({ userId, itemType, itemId });
  // update user dashboard count asynchronously
  incrementBookmarkCount(userId).catch((e) => console.error("bookmark count inc failed", e));
  return mapBookmark(doc);
}

export async function removeBookmark(userId: string, itemType: string, itemId: string) {
  const doc = await Bookmark.findOneAndUpdate(
    { userId, itemType, itemId, ...notDeleted },
    { $set: { isDeleted: true } },
    { new: true }
  );
  return doc ? mapBookmark(doc) : null;
}

export async function listBookmarks(userId: string) {
  const docs = await Bookmark.find({ userId, ...notDeleted }).lean();
  return docs.map(mapBookmark);
}
