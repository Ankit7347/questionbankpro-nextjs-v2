// src/models/dto/contactUs.mapper.ts
import { ContactUsDTO } from "./contactUs.dto";
import { BaseDTO } from "./base.dto";

interface ContactUsDocument {
  _id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  updatedBy?: string;
}

export function mapContactUs(
  doc: ContactUsDocument
): ContactUsDTO {
  const base: BaseDTO = {
    id: doc._id,
    isDeleted: doc.isDeleted,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    updatedBy: doc.updatedBy,
  };

  return {
    ...base,
    name: doc.name,
    phone: doc.phone,
    email: doc.email,
    message: doc.message,
  };
}
