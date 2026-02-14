// src/services/server/activityLog.service.ts

import ActivityLog from "@/models/mongoose/ActivityLog.schema";
import { mapActivityLog } from "@/models/dto/activityLog.mapper";
import { notDeleted } from "./helpers";

export async function logActivity(userId: string, type: string, payload: any = {}) {
  const doc = await ActivityLog.create({ userId, type, payload });
  return mapActivityLog(doc);
}

export async function getActivities(userId: string, limit: number = 50) {
  const docs = await ActivityLog.find({ userId, ...notDeleted })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  return docs.map(mapActivityLog);
}
