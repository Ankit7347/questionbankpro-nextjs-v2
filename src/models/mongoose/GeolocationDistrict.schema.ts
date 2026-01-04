// src/models/mongoose/GeolocationDistrict.schema.ts

import { Schema, model, models } from "mongoose";
import {
  BaseSchemaFields,
  BaseSchemaOptions,
} from "./base.schema";

const GeolocationDistrictSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

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

// prevent duplicate district names per state
GeolocationDistrictSchema.index(
  { name: 1, stateId: 1 },
  { unique: true }
);

export const GeolocationDistrictModel =
  models.GeolocationDistrict ||
  model("GeolocationDistrict", GeolocationDistrictSchema);
