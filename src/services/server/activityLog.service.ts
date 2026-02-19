// src/services/server/activityLog.service.ts

import ActivityLog from "@/models/mongoose/ActivityLog.schema";
import { mapActivityLog } from "@/models/dto/activityLog.mapper";
import { notDeleted } from "./helpers";
import User from "@/models/mongoose/User.schema";
import dbConnect from "@/lib/mongodb";
import { NotFound } from "@/lib/apiError";


/**
 * Get user MongoDB ID from session UUID
 */
async function getUserIdFromSession(userUuid: string) {
  await dbConnect();
  const user = await User.findOne({ uuid: userUuid }).select("_id").lean();
  if (!user) {
    throw NotFound("User not found");
  }
  return user._id;
}
export async function logActivity(userUuidFromSession: string, type: string, payload: any = {}) {
  await dbConnect();
  const userId = await getUserIdFromSession(userUuidFromSession);
  const doc = await ActivityLog.create({ userId, type, payload });
  return mapActivityLog(doc);
}

export async function getActivities(userUuidFromSession: string, limit: number = 50) {
  await dbConnect();
  const userId = await getUserIdFromSession(userUuidFromSession);
  const docs = await ActivityLog.find({ userId, ...notDeleted })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  return docs.map(mapActivityLog);
}
