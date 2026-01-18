// src/services/server/location.server.ts
import dbConnect from "@/lib/mongodb";
import GeolocationState from "@/models/mongoose/GeolocationState.schema";
import GeolocationDistrict from "@/models/mongoose/GeolocationDistrict.schema";
import { mapStateDTO, mapDistrictDTO } from "@/models/dto/location.mapper";

/**
 * Fetches all active states and maps them to a clean DTO format.
 * Transforms MongoDB '_id' into a standard 'id' string.
 */
export async function getStateList() {
  await dbConnect();

  const states = await GeolocationState.find({
    isDeleted: false,
  })
    .sort({ stateName: 1 })
    .lean();

  // Mapping ensures the frontend receives 'id' instead of '_id'
  return states.map((state) => mapStateDTO(state));
}

/**
 * Fetches all active districts for a specific state.
 * @param stateId - The string ID (mapped from MongoDB _id) of the parent state.
 */
export async function getDistrictListByStateId(stateId: string) {
  await dbConnect();
  // Filters districts by the foreign key geolocationStateId
  const districts = await GeolocationDistrict.find({
    geolocationStateId: stateId,
    isDeleted: false,
  })
    .sort({ districtName: 1 })
    .lean();

  // Mapping ensures the frontend receives 'id' instead of '_id'
  return districts.map((district) => mapDistrictDTO(district));
}