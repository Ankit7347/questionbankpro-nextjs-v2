// src/models/dto/user.mapper.ts

import { mapBaseFields } from "./base.mapper";

export const mapUser = (doc: any) => ({
  ...mapBaseFields(doc),
  uuid: doc.uuid,
  name: doc.name,
  email: doc.email,
  phone: doc.phone,
  role: doc.role,
  className: doc.className,
  competition: doc.competition,
  stateId: doc.stateId?.toString(),
  districtId: doc.districtId?.toString(),
  isActive: doc.isActive,
});
