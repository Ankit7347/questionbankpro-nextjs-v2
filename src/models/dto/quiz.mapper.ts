// src/models/dto/quiz.mapper.ts

import { mapBaseFields } from "./base.mapper";

export const mapQuiz = (doc: any) => ({
  ...mapBaseFields(doc),
  title: doc.title,
  quizType: doc.quizType,
  linkedEntityId: doc.linkedEntityId?.toString(),
  totalQuestions: doc.totalQuestions,
  durationMinutes: doc.durationMinutes,
});
