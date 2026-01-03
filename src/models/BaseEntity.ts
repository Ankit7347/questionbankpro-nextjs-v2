// models/BaseEntity.ts
export interface BaseEntity {
  id: string;

  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;

  updatedBy?: string; // user UUID
}
