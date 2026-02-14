// src/services/bestBook.service.ts

import BestBook from "@/models/mongoose/BestBook.schema";
import { mapBestBook } from "@/models/dto/bestBook.mapper";
import { notDeleted } from "./helpers";

export async function listBestBooks() {
  const docs = await BestBook.find(notDeleted);
  return docs.map(mapBestBook);
}
