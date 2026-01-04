// src/models/dto/topic.mapper.ts

import { mapBaseFields } from "./base.mapper";

export const mapTopic = (doc: any) => ({
  ...mapBaseFields(doc),
  chapterId: doc.chapterId?.toString(),
  name: doc.name,
  difficulty: doc.difficulty,
  isCoreTopic: doc.isCoreTopic,
});
