// src/app/api/dashboard/bookmarks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { listBookmarks } from "@/services/server/bookmark.service";

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

    const items = await listBookmarks(userUuid);
    return NextResponse.json({ bookmarks: items }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
