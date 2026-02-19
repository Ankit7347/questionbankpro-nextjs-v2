// src/app/api/dashboard/notes/[subjectSlug]/[chapterSlug]/route.ts
/**
 * GET /api/dashboard/notes/[subjectSlug]/[chapterSlug]
 * ====================================================
 * Fetch topics within a chapter with user progress
 * Requires: Authentication via lib/auth
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getNotesByChapter } from '@/services/server/notes.server';
import { ok, fail } from '@/lib/response.util';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ subjectSlug: string; chapterSlug: string }> }
) {
  try {
    const { subjectSlug, chapterSlug } = await params;

    // Authenticate user
    const session = await auth();
    const userUuid = session?.user?.id;
    if (!userUuid) {
      return NextResponse.json(fail({ message: 'Unauthorized - no session' }), { status: 401 });
    }

    // Fetch notes by chapter
    const data = await getNotesByChapter(userUuid, subjectSlug, chapterSlug);
    console.log('[notes-chapter-api] Data fetched for chapter:', chapterSlug);
    return NextResponse.json(ok(data), { status: 200 });
  } catch (error) {
    console.error('[notes-chapter-api] error:', error);
    return NextResponse.json(fail(error), { status: 500 });
  }
}