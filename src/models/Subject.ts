// models/Subject.ts
import { BaseEntity } from "./BaseEntity";

export interface Subject extends BaseEntity {
  syllabusId: string;

  name: string;
  code?: string;

  order: number;

  isActive: boolean;
}
