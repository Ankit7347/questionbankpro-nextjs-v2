// src/services/server/register.server.ts
import dbConnect from "@/lib/mongodb";
import User from "@/models/mongoose/User.schema";
import { mapUser } from "@/models/dto/user.mapper";
import { BadRequest } from "@/lib/apiError";
import { RegisterFormData } from "@/dto/register.ui.dto";
import bcrypt from "bcryptjs";
import crypto from "crypto";

/**
 * Executes user registration logic on the server.
 * Assumes payload is already validated by API route.
 */
export async function executeRegistration(data: RegisterFormData) {
  await dbConnect();

  /* =========================
     1. Duplicate Email Check
  ========================== */
  const emailLower = data.email.toLowerCase();

  const existingUser = await User.findOne({
    email: emailLower,
    isDeleted: false,
  }).lean();

  if (existingUser) {
    throw BadRequest("User with this email already exists.");
  }

  /* =========================
     2. Hash Password
  ========================== */
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(data.password, salt);

  /* =========================
     3. Create User Document
     (Schema-aligned)
  ========================== */
  const newUser = await User.create({
    uuid: crypto.randomUUID(),

    // core
    name: data.name,
    email: emailLower,
    phone: data.phone,
    passwordHash,

    // location (ID + snapshot)
    geolocationStateId: data.geolocationStateId,
    geolocationDistrictId: data.geolocationDistrictId,
    stateName: data.stateName,
    districtName: data.districtName,

    // education
    educationLevel: data.educationLevel,
    examType: data.examType,
    className: data.className,
    courseName: data.courseName,

    // sub-exam
    subExamId: data.subExamId,
    subExamSlug: data.subExamSlug,

    // system
    isActive: true,
  });

  /* =========================
     4. Return Mapped DTO
  ========================== */
  return mapUser(newUser);
}
