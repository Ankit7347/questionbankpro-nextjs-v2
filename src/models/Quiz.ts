// models/Quiz.ts
import { BaseEntity } from "./BaseEntity";

export interface Quiz extends BaseEntity {
  title: string;

  quizType:
    | "topic"
    | "chapter"
    | "subject"
    | "full_syllabus"
    | "mock_test";

  linkedEntityId: string;

  totalQuestions: number;
  durationMinutes: number;
}
