// src/models/mongoose/SubjectMap.schema.ts 
import { Schema, model, models, Types } from "mongoose";
import {
  BaseSchemaFields,
  BaseSchemaOptions,
} from "./base.schema";

const SubjectMapSchema = new Schema(
  {
    syllabusId: {
      type: Types.ObjectId,
      ref: "Syllabus",
      required: true,
      index: true,
    },

    subjectId: {
      type: Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    order: {
      type: Number,
      required: true,
    },

    isOptional: {
      type: Boolean,
      default: false,
    },

    isRemoved: {
      type: Boolean,
      default: false,
    },

    validFrom: {
      type: Number,
      required: true,
    },

    validTo: {
      type: Number,
      default: null,
    },

    ...BaseSchemaFields,
  },
  BaseSchemaOptions
);

export default models.SubjectMap || model("SubjectMap", SubjectMapSchema);
