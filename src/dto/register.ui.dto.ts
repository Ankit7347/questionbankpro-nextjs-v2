// src/dto/register.ui.dto.ts
export interface RegisterFormData {
  // Basic
  name: string;
  email: string;
  phone: string;
  password: string;

  // Location
  geolocationStateId: string;
  geolocationDistrictId: string;
  stateName: string;
  districtName: string;

  // Education
  educationLevel: "school" | "ug" | "pg";
  examType: "school" | "program" | "competitive";
  className: string;
  courseName: string;

  // SubExam
  subExamId: string;
  subExamSlug: string;
}


/**
 * Clean User object for UI use only
 */
export interface UserUI {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: string;
}