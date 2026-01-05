// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createContact } from "@/services/server/contactUs.server";
import {
  CreateContactRequestDTO,
  ContactResponseDTO,
} from "@/dto/contact.dto";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateContactRequestDTO;

    const name = body.name?.trim();
    const phone = body.phone?.trim();
    const email = body.email?.trim();
    const message = body.message?.trim();

    if (!name || !phone || !email || !message) {
      return NextResponse.json<ContactResponseDTO>(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    await createContact({ name, phone, email, message });

    return NextResponse.json<ContactResponseDTO>(
      { success: true, message: "Message sent successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact API error:", error);

    return NextResponse.json<ContactResponseDTO>(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
