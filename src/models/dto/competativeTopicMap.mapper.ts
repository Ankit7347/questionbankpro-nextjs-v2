// src/models/dto/competitiveTopicMap.mapper.ts

import { mapBaseFields } from "./base.mapper";

export const mapCompetitiveTopicMap = (doc: any) => ({
  ...mapBaseFields(doc),
  examId: doc.examId?.toString(),
  topicId: doc.topicId?.toString(),
  weightage: doc.weightage,
  priority: doc.priority,
});
