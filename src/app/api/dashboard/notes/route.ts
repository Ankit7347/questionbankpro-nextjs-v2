// src/app/api/dashboard/notes/route.ts
/**
 * GET /api/dashboard/notes
 * =======================
 * Returns notes overview for authenticated user
 * - Subjects with notes
 * - Statistics
 * - Recent note activity
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getNotesOverview } from '@/services/server/notes.server';
import { ok, fail } from '@/lib/response.util';
import { logActivity } from '@/services/server/activityLog.service';

export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(fail({ message: 'Unauthorized' }), { status: 401 });
    }

    const userUuid = session.user.id;

    // Log activity
    logActivity(userUuid, 'notes_overview', {});

    // Fetch notes overview
    const data = await getNotesOverview(userUuid);

    return NextResponse.json(ok(data), { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(fail(error), { status: 500 });
  }
}