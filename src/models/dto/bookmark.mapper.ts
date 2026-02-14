// src/models/dto/bookmark.mapper.ts
import { mapBaseFields } from "./base.mapper";
import { BookmarkDTO } from "./bookmark.dto";

export const mapBookmark = (doc: any): BookmarkDTO => {
  if (!doc) return {} as BookmarkDTO;
  return {
    ...mapBaseFields(doc),
    userId: doc.userId,
    itemType: doc.itemType,
    itemId: doc.itemId
  };
};
