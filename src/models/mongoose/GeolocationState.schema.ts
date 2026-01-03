// mongoose/GeolocationState.schema.ts
import { Schema, model, models } from "mongoose";
import { BaseSchemaFields, BaseSchemaOptions } from "./base.schema";

const GeolocationStateSchema = new Schema(
  {
    stateName: { type: String, required: true },
    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

export const GeolocationStateModel =
  models.GeolocationState ||
  model("GeolocationState", GeolocationStateSchema);
