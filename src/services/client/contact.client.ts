import {
  CreateContactRequestDTO,
  ContactResponseDTO,
} from "@/dto/contact.dto";

export async function submitContact(
  payload: CreateContactRequestDTO
): Promise<ContactResponseDTO> {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return res.json() as Promise<ContactResponseDTO>;
}
