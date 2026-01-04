// src/models/BaseEntity.ts

export interface BaseEntity {
  id: string; // mapped from MongoDB _id

  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;

  updatedBy?: string; // UUID of admin/user
}
