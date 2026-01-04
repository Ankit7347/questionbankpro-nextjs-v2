// src/models/dto/question.mapper.ts

import { mapBaseFields } from "./base.mapper";

export const mapQuestion = (doc: any) => ({
  ...mapBaseFields(doc),
  topicId: doc.topicId?.toString(),
  type: doc.type,
  questionText: doc.questionText,
  options: doc.options ?? [],
  correctAnswer: doc.correctAnswer,
  difficulty: doc.difficulty,
  isPreviousYear: doc.isPreviousYear,
});
