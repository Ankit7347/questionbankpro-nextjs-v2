// src/services/contactUs.service.ts

import mongoose, { Model } from "mongoose";
import dbConnect from "@/lib/mongodb";
import "@/models/mongoose/ContactUs.schema";
import { CreateContactRequestDTO } from "@/dto/contact.dto";

interface ContactDbModel {
  name: string;
  phone: string;
  email: string;
  message: string;
  isDeleted: boolean;
}

export async function createContact(
  payload: CreateContactRequestDTO
): Promise<void> {
  await dbConnect();

  const ContactModel = mongoose.model<ContactDbModel>(
    "ContactUs"
  ) as Model<ContactDbModel>;

  await ContactModel.create({
    name: payload.name,
    phone: payload.phone,
    email: payload.email,
    message: payload.message,
    isDeleted: false,
  });
}
