// src/app/api/dashboard/history/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { getActivities } from "@/services/server/activityLog.service";

async function resolveUser(req?: Request) {
  await dbConnect();
  const session = await auth();
  const headerUuid = req?.headers.get("x-user-id") || undefined;
  const userUuid = session?.user?.id || headerUuid;
  if (!userUuid) return null;
  return userUuid;
}

export async function GET(req: NextRequest) {
  try {
    const userUuid = await resolveUser(req);
    if (!userUuid) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "50", 10);
    const activities = await getActivities(userUuid, limit);
    return NextResponse.json({ activities }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
