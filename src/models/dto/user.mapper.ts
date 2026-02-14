// src/models/dto/user.mapper.ts
import { mapBaseFields } from "./base.mapper";
import { UserDTO } from "./user.dto";

export const mapUser = (doc: any): UserDTO => {
  if (!doc) return {} as UserDTO;

  return {
    ...mapBaseFields(doc),

    // identity
    uuid: doc.uuid || doc.id || "",
    name: doc.name || "",
    email: doc.email || "",
    phone: doc.phone || "",

    // access & UI
    role: doc.role || "student",
    uiMode: doc.uiMode || "light",
    image: doc.image || "",

    // preferences & dashboard
    preferences: (doc.preferences as any) || { theme: doc.uiMode || "system" },
    dashboard: (doc.dashboard as any) || {},

    // education
    educationLevel: doc.educationLevel,
    examType: doc.examType,
    className: doc.className,
    courseName: doc.courseName,

    // sub-exam
    subExamId: doc.subExamId?.toString() || "",
    subExamSlug: doc.subExamSlug,

    // location
    stateName: doc.stateName,
    districtName: doc.districtName,
    geolocationStateId: doc.geolocationStateId?.toString() || "",
    geolocationDistrictId: doc.geolocationDistrictId?.toString() || "",

    // system
    isActive: doc.isActive ?? true,
  };
};
