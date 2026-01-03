// models/Course.ts
import { BaseEntity } from "./BaseEntity";

export interface Course extends BaseEntity {
  educationLevelId: string;

  name: string; // Class 12, BSc Physics
  stream?: string; // Science / Arts / Commerce
  durationYears?: number;

  isActive: boolean;
}
