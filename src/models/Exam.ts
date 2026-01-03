// models/Exam.ts
import { BaseEntity } from "./BaseEntity";

export interface Exam extends BaseEntity {
  name: string; // CBSE, ICSE, JEE, NEET

  examType: "board" | "competitive" | "university";
  conductedBy?: string;

  isActive: boolean;
}
