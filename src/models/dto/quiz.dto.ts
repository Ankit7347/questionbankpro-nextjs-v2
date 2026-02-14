// src/models/dto/quiz.dto.ts
import { BaseDTO } from "./base.dto";

export interface QuizDTO extends BaseDTO {
  title: { en: string; hi?: string };
  description?: { en?: string; hi?: string };
  quizType: "topic" | "chapter" | "subject" | "full_syllabus" | "mock_test";

  // hierarchy
  examId: string;
  subExamId: string;
  subjectId?: string;
  chapterId?: string;
  topicId?: string;

  // questions
  questionIds?: string[];
  totalQuestions: number;
  durationMinutes: number;
  totalMarks: number;
  marksPerQuestion?: number;

  // config
  displayOrder?: number;
  isPublished?: boolean;
  publishedAt?: string;
  startDate?: string;
  endDate?: string;
  allowMultipleAttempts?: boolean;

  negativeMarking?: {
    enabled: boolean;
    marksPerWrongAnswer?: number;
  };
}
