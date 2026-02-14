// src/models/dto/quizSubmission.dto.ts
import { BaseDTO } from "./base.dto";

export interface QuizSubmissionDTO extends BaseDTO {
  userId: string;
  quizId: string;
  attemptNumber: number;
  startedAt?: string;
  submittedAt?: string;
  timeSpentSeconds: number;

  answers: Array<{
    questionId: string;
    selectedOptionId?: string;
    answerText?: string;
    isCorrect?: boolean;
    marksAwarded?: number;
  }>;

  totalMarksObtained: number;
  totalMarksMaximum: number;
  percentageScore: number;
  correctAnswersCount: number;
  wrongAnswersCount: number;
  unattemptedCount: number;

  status: "in_progress" | "submitted" | "evaluated";
}
