// src/models/dto/user.dto.ts
import { BaseDTO } from "./base.dto";

export interface UserDTO extends BaseDTO {
  uuid: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  uiMode: "light" | "dark";
  image?: string; // For NextAuth compatibility
  className?: string;
  courseName: string | null;
  competition?: string;
  stateName?: string;
  districtName?: string;
  geolocationStateId?: string;
  geolocationDistrictId?: string;
  isActive: boolean;
}