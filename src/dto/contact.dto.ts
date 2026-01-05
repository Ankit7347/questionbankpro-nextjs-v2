// src/dto/contact.dto.ts

export interface CreateContactRequestDTO {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export interface ContactResponseDTO {
  success: boolean;
  message: string;
}
