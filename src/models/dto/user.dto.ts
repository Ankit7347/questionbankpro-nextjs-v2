// src/models/dto/user.dto.ts
import { BaseDTO } from "./base.dto";

export interface UserDTO extends BaseDTO {
  // identity
  uuid: string;
  name: string;
  email: string;
  phone: string;

  // access & UI
  role: "student" | "contentadmin" | "superadmin";
  uiMode: "light" | "dark";
  image?: string;

  // education
  educationLevel: "school" | "ug" | "pg";
  examType: "school" | "program" | "competitive";
  className: string;
  courseName: string;

  // sub-exam
  subExamId: string;
  subExamSlug: string;

  // location
  stateName: string;
  districtName: string;
  geolocationStateId: string;
  geolocationDistrictId: string;

  // system
  isActive: boolean;

  // dynamic preferences stored on user
  preferences?: {
    theme?: "light" | "dark" | "system";
    [key: string]: any;
  };

  // lightweight dashboard summaries
  dashboard?: {
    notes?: { total: number; lastTopicId?: string };
    bookmarksCount?: number;
    historySummary?: { lastViewedAt?: string; lastItem?: string };
    performanceSummary?: { quizzesTaken?: number; bestScore?: number };
    [key: string]: any;
  };
}
