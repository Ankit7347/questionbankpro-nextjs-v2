// src/models/dto/educationLevel.mapper.ts

import { mapBaseFields } from "./base.mapper";

export const mapEducationLevel = (doc: any) => ({
  ...mapBaseFields(doc),
  type: doc.type,
  name: doc.name,
  order: doc.order,
  isActive: doc.isActive,
});
