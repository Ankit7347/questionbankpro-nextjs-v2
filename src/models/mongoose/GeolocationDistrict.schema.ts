// mongoose/GeolocationDistrict.schema.ts
import { Schema, model, models } from "mongoose";
import { BaseSchemaFields, BaseSchemaOptions } from "./base.schema";

const GeolocationDistrictSchema = new Schema(
  {
    districtName: { type: String, required: true },
    stateId: {
      type: Schema.Types.ObjectId,
      ref: "GeolocationState",
      required: true,
      index: true,
    },
    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

export const GeolocationDistrictModel =
  models.GeolocationDistrict ||
  model("GeolocationDistrict", GeolocationDistrictSchema);
