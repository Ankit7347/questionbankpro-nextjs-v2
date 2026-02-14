// src/models/dto/bookmark.dto.ts
import { BaseDTO } from "./base.dto";

export interface BookmarkDTO extends BaseDTO {
  userId: string;
  itemType: string;
  itemId: string;
}
