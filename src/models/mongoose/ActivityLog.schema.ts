// src/models/mongoose/ActivityLog.schema.ts
import { Schema, model, models } from "mongoose";
import { BaseSchemaFields, BaseSchemaOptions } from "./base.schema";

const ActivityLogSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      // e.g. 'note_view', 'quiz_attempt', 'page_visit', etc.
    },
    payload: {
      type: Schema.Types.Mixed,
      default: {},
    },
    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);


export default models.ActivityLog || model("ActivityLog", ActivityLogSchema);
