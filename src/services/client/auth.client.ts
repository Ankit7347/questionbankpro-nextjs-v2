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
