// models/Question.ts
import { BaseEntity } from "./BaseEntity";

export interface Question extends BaseEntity {
  topicId: string;

  type: "mcq" | "numerical" | "true_false";

  questionText: string;

  options?: string[];
  correctAnswer: string;

  difficulty: "easy" | "medium" | "hard";
  isPreviousYear: boolean;
}
