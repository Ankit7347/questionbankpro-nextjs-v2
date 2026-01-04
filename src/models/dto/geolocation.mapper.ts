// src/models/dto/geolocation.mapper.ts

import { mapBaseFields } from "./base.mapper";

export const mapGeolocationState = (doc: any) => ({
  ...mapBaseFields(doc),
  name: doc.name,
  code: doc.code,
});

export const mapGeolocationDistrict = (doc: any) => ({
  ...mapBaseFields(doc),
  name: doc.name,
  stateId: doc.stateId?.toString(),
});
