// src/models/dto/quizSubmission.mapper.ts
import { mapBaseFields } from "./base.mapper";
import { QuizSubmissionDTO } from "./quizSubmission.dto";

export const mapQuizSubmission = (doc: any): QuizSubmissionDTO => {
  if (!doc) return {} as QuizSubmissionDTO;

  return {
    ...mapBaseFields(doc),
    userId: doc.userId || "",
    quizId: doc.quizId?.toString() || "",
    attemptNumber: doc.attemptNumber || 1,
    startedAt: doc.startedAt?.toISOString(),
    submittedAt: doc.submittedAt?.toISOString(),
    timeSpentSeconds: doc.timeSpentSeconds || 0,
    answers: (doc.answers || []).map((ans: any) => ({
      questionId: ans.questionId?.toString() || "",
      selectedOptionId: ans.selectedOptionId,
      answerText: ans.answerText,
      isCorrect: ans.isCorrect,
      marksAwarded: ans.marksAwarded || 0,
    })),
    totalMarksObtained: doc.totalMarksObtained || 0,
    totalMarksMaximum: doc.totalMarksMaximum || 0,
    percentageScore: doc.percentageScore || 0,
    correctAnswersCount: doc.correctAnswersCount || 0,
    wrongAnswersCount: doc.wrongAnswersCount || 0,
    unattemptedCount: doc.unattemptedCount || 0,
    status: doc.status || "in_progress",
  };
};
