// src/models/dto/quiz.mapper.ts

import { mapBaseFields } from "./base.mapper";
import { QuizDTO } from "./quiz.dto";

export const mapQuiz = (doc: any): QuizDTO => {
  if (!doc) return {} as QuizDTO;

  return {
    ...mapBaseFields(doc),
    title: doc.title,
    description: doc.description,
    quizType: doc.quizType,
    examId: doc.examId?.toString() || "",
    subExamId: doc.subExamId?.toString() || "",
    subjectId: doc.subjectId?.toString(),
    chapterId: doc.chapterId?.toString(),
    topicId: doc.topicId?.toString(),
    questionIds: doc.questionIds?.map((id: any) => id.toString()) || [],
    totalQuestions: doc.totalQuestions || 0,
    durationMinutes: doc.durationMinutes || 0,
    totalMarks: doc.totalMarks || 0,
    marksPerQuestion: doc.marksPerQuestion,
    displayOrder: doc.displayOrder,
    isPublished: doc.isPublished,
    publishedAt: doc.publishedAt?.toISOString(),
    startDate: doc.startDate?.toISOString(),
    endDate: doc.endDate?.toISOString(),
    allowMultipleAttempts: doc.allowMultipleAttempts,
    negativeMarking: doc.negativeMarking,
  };
};
