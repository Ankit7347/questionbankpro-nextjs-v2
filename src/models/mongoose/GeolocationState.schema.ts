// src/models/mongoose/GeolocationState.schema.ts

import { Schema, model, models } from "mongoose";
import {
  BaseSchemaFields,
  BaseSchemaOptions,
} from "./base.schema";

const GeolocationStateSchema = new Schema(
  {
    stateName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    stateCode: {
      type: String, // optional: UP, MH, etc
    },

    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

export default models.GeolocationState ||  model("GeolocationState", GeolocationStateSchema);
