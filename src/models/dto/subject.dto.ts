// src/models/dto/subject.dto.ts

import { BaseDTO } from "./base.dto";

export interface SubjectDTO extends BaseDTO {
  name: string;
  slug: string;
  description: string;
}
