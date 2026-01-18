// src/models/dto/user.mapper.ts
import { mapBaseFields } from "./base.mapper";
import { UserDTO } from "./user.dto";

export const mapUser = (doc: any): UserDTO => {
  if (!doc) return {} as UserDTO;

  return {
    ...mapBaseFields(doc),
    // Use uuid if available, fallback to id (from NextAuth session)
    uuid: doc.uuid || doc.id || "",
    name: doc.name || "Guest",
    email: doc.email || "",
    phone: doc.phone || "",
    role: doc.role || "user",
    uiMode: doc.uiMode || "light",
    image: doc.image || "", // Added for the avatar image
    className: doc.className || "",
    courseName: doc.courseName || null,
    competition: doc.competition || "",
    stateName: doc.stateName || "",
    districtName: doc.districtName || "",
    // Handling potential null/undefined for geolocation IDs
    geolocationStateId: doc.geolocationStateId?.toString() || "",
    geolocationDistrictId: doc.geolocationDistrictId?.toString() || "",
    isActive: doc.isActive ?? true,
  };
};