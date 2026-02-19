// src/app/api/dashboard/notes/[subjectSlug]/route.ts
/**
 * GET /api/dashboard/notes/[subjectSlug]
 * =====================================
 * Fetch chapters for a subject with user progress
 * Requires: Authentication via lib/auth
 */

import { NextRequest, NextResponse } from 'next/server';
import { getNotesBySubject } from '@/services/server/notes.server';
import { ok, fail } from '@/lib/response.util';
import { auth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ subjectSlug: string }> }
) {
  try {
    const { subjectSlug } = await params;

    // Authenticate user
    const session = await auth();
    const userUuid = session?.user?.id;
    if (!userUuid) {
      return NextResponse.json(fail({ message: 'Unauthorized - no session' }), { status: 401 });
    }

    // Fetch notes by subject
    const data = await getNotesBySubject(userUuid, subjectSlug);
    console.log("[notes-api] Data fetched for subject:", subjectSlug);
    return NextResponse.json(ok(data), { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(fail(error), { status: 500 });
  }
}