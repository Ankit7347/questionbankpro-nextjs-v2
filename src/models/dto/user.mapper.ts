// dto/user.mapper.ts
import { mapBaseFields } from "./base.mapper";

export const mapUser = (doc: any) => ({
  ...mapBaseFields(doc),
  uuid: doc.uuid,
  name: doc.name,
  email: doc.email,
  phone: doc.phone,
  state: doc.state,
  district: doc.district,
  className: doc.className,
  role: doc.role,
  competition: doc.competition,
});
