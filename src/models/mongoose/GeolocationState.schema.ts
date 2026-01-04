// src/models/mongoose/GeolocationState.schema.ts

import { Schema, model, models } from "mongoose";
import {
  BaseSchemaFields,
  BaseSchemaOptions,
} from "./base.schema";

const GeolocationStateSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    code: {
      type: String, // optional: UP, MH, etc
    },

    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

export const GeolocationStateModel =
  models.GeolocationState ||
  model("GeolocationState", GeolocationStateSchema);
