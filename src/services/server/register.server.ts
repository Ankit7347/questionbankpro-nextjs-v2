// src/services/server/register.server.ts
import dbConnect from "@/lib/mongodb";
import User from "@/models/mongoose/User.schema";
import GeolocationDistrict from "@/models/mongoose/GeolocationDistrict.schema";
import { mapUser } from "@/models/dto/user.mapper";
import { BadRequest, NotFound } from "@/lib/apiError"; 
import { RegisterFormData } from "@/dto/register.ui.dto"; // Import the DTO
import bcrypt from "bcryptjs";
import crypto from "crypto";

/**
 * Executes user registration logic on the server.
 * Uses RegisterFormData to ensure 'data' is strictly typed.
 */
export async function executeRegistration(data: RegisterFormData) {
  await dbConnect();

  /** 1️⃣ Duplicate check */
  const emailLower = data.email.toLowerCase();
  const existingUser = await User.findOne({ 
    email: emailLower, 
    isDeleted: false 
  }).lean();
  
  if (existingUser) {
    throw BadRequest("User with this email already exists.");
  }

  /** 2️⃣ Resolve Geolocation Data */
  const districtDoc = await GeolocationDistrict.findOne({ 
    districtName: data.districtName 
  }).lean();

  if (!districtDoc) {
    throw NotFound(`The district "${data.districtName}" was not found.`);
  }

  /** 3️⃣ Hash Password */
  // TypeScript now knows data.password exists because of the Interface
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(data.password, salt);

  /** 4️⃣ Create User Document */
  const newUser = await User.create({
    uuid: crypto.randomUUID(),
    name: data.name,
    email: emailLower,
    phone: data.phone,
    passwordHash: passwordHash,
    className: data.className,
    courseName: data.courseName || null,
    competition: data.competition,
    stateName: data.stateName,
    districtName: districtDoc.districtName,
    geolocationStateId: districtDoc.geolocationStateId,
    geolocationDistrictId: districtDoc._id,
    isActive: true,
  });

  /** 5️⃣ Return mapped DTO */
  // mapUser converts the Mongoose document to a UI-friendly UserDTO
  return mapUser(newUser);
}