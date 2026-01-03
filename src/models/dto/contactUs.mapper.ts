// dto/contactUs.mapper.ts
import { mapBaseFields } from "./base.mapper";

export const mapContactUs = (doc: any) => ({
  ...mapBaseFields(doc),
  name: doc.name,
  phone: doc.phone,
  email: doc.email,
  text: doc.text,
});
