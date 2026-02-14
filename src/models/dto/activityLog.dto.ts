// src/models/dto/activityLog.dto.ts
import { BaseDTO } from "./base.dto";

export interface ActivityLogDTO extends BaseDTO {
  userId: string;
  type: string;
  payload: any;
}
