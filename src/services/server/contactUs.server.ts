// src/services/contactUs.service.ts

import { ContactUsModel } from "@/models/mongoose/ContactUs.schema";
import { mapContactUs } from "@/models/dto/contactUs.mapper";

export async function submitContact(payload: any) {
  const doc = await ContactUsModel.create(payload);
  return mapContactUs(doc);
}
