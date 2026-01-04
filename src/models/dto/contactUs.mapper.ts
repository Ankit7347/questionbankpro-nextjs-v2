// src/models/dto/contactUs.mapper.ts

import { mapBaseFields } from "./base.mapper";

export const mapContactUs = (doc: any) => ({
  ...mapBaseFields(doc),
  name: doc.name,
  email: doc.email,
  phone: doc.phone,
  message: doc.message,
});
