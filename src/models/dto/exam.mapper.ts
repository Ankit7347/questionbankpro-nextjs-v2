// src/models/dto/exam.mapper.ts
import { mapBaseFields } from "./base.mapper";
import { Exam } from "../Exam";

export function mapExam(doc: any): Exam {
  return {
    ...mapBaseFields(doc),
    name: doc.name,
    examType: doc.examType,
    conductedBy: doc.conductedBy,
    isActive: doc.isActive,
  };
}
