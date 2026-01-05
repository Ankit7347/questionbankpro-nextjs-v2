// src/dto/auth.dto.ts

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface ForgotPasswordRequestDTO {
  email: string;
}

export interface AuthResponseDTO {
  success: boolean;
  message: string;
}
