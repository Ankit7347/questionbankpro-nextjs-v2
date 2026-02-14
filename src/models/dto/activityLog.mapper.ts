// src/models/dto/activityLog.mapper.ts
import { mapBaseFields } from "./base.mapper";
import { ActivityLogDTO } from "./activityLog.dto";

export const mapActivityLog = (doc: any): ActivityLogDTO => {
  if (!doc) return {} as ActivityLogDTO;
  return {
    ...mapBaseFields(doc),
    userId: doc.userId,
    type: doc.type,
    payload: doc.payload
  };
};
