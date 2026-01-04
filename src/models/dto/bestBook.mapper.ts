// src/models/dto/bestBook.mapper.ts

import { mapBaseFields } from "./base.mapper";

export const mapBestBook = (doc: any) => ({
  ...mapBaseFields(doc),
  title: doc.title,
  author: doc.author,
  subject: doc.subject,
  className: doc.className,
  board: doc.board,
  competitive: doc.competitive,
  imageUrl: doc.imageUrl,
  description: doc.description,
  tags: doc.tags ?? [],
});
