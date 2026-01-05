// src/dto/contact.dto.ts
import { BaseDTO } from "./base.dto";

export interface ContactUsDTO extends BaseDTO {
  name: string;
  phone: string;
  email: string;
  message: string;
}

