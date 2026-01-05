// src/services/client/auth.client.ts

import {
  ForgotPasswordRequestDTO,
  AuthResponseDTO,
} from "@/dto/auth.dto";

export async function forgotPassword(
  payload: ForgotPasswordRequestDTO
): Promise<AuthResponseDTO> {
  const res = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? "Request failed");
  }

  return res.json();
}

export interface ValidateResetTokenResponse {
  valid: boolean;
}

export async function validateResetToken(
  payload: { email: string; otp: string }
): Promise<ValidateResetTokenResponse> {
  const params = new URLSearchParams(payload);

  const res = await fetch(
    `/api/auth/reset/validate?${params.toString()}`,
    { method: "GET" }
  );

  if (!res.ok) {
    throw new Error("Failed to validate reset token");
  }

  return res.json();
}

export async function confirmPasswordReset(payload: {
  email: string;
  otp: string;
  password: string;
}): Promise<{ success: boolean }> {
  const res = await fetch("/api/auth/reset/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? "Password reset failed");
  }

  return res.json();
}
