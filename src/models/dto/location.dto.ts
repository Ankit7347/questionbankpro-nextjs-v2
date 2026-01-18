// src/models/dto/location.dto.ts
import { BaseDTO } from "./base.dto";

export interface GeolocationDistrictDTO extends BaseDTO {
  districtName: string;
  geolocationStateId: string;
}

export interface GeolocationStateDTO extends BaseDTO {
  stateName: string;
  stateCode?: string;
  districts?: GeolocationDistrictDTO[];
}