// models/EducationLevel.ts
import { BaseEntity } from "./BaseEntity";

export interface EducationLevel extends BaseEntity {
  type: "school" | "graduation" | "postgraduation" | "competitive";

  name: string; // Class 9, BSc, MSc
  order: number;

  isActive: boolean;
}
