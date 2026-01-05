// src/models/dto/base.dto.ts
export interface BaseDTO {
  id: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  updatedBy?: string;
}
