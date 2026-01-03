// models/Syllabus.ts
import { BaseEntity } from "./BaseEntity";

export interface Syllabus extends BaseEntity {
  examId: string;
  courseId: string;

  academicYear?: string; // 2024–25

  isActive: boolean;
}
