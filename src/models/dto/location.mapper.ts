// src/models/dto/location.mapper.ts

import { mapBaseFields } from "./base.mapper";
import { GeolocationStateDTO, GeolocationDistrictDTO } from "./location.dto";

/**
 * Maps a Mongoose State document to a Data Transfer Object (DTO).
 * Converts the internal MongoDB '_id' to a clean 'id' string for the frontend.
 */
export function mapStateDTO(state: any): GeolocationStateDTO {
  return {
    ...mapBaseFields(state),
    id: state._id ? state._id.toString() : "",
    stateName: state.stateName || "",
    stateCode: state.stateCode || "",
  };
}

/**
 * Maps a Mongoose District document to a Data Transfer Object (DTO).
 * Ensures 'id' is used instead of '_id' and districtName is correctly mapped.
 */
export function mapDistrictDTO(district: any): GeolocationDistrictDTO {
  return {
    ...mapBaseFields(district),
    id: district._id ? district._id.toString() : "",
    districtName: district.districtName || "",
    geolocationStateId: district.geolocationStateId ? district.geolocationStateId.toString() : "",
  };
}