// src/app/api/dashboard/notes/[subjectSlug]/[chapterSlug]/[topicSlug]/route.ts
/**
 * GET /api/dashboard/notes/[subjectSlug]/[chapterSlug]/[topicSlug]
 * ===============================================================
 * Fetch notes for a topic
 * Requires: Authentication via lib/auth
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getNotesByTopic, trackNoteAccess } from '@/services/server/notes.server';
import { ok, fail } from '@/lib/response.util';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ subjectSlug: string; chapterSlug: string; topicSlug: string }> }
) {
  try {
    const { subjectSlug, chapterSlug, topicSlug } = await params;

    // Authenticate user
    const session = await auth();
    const userUuid = session?.user?.id;
    if (!userUuid) {
      return NextResponse.json(fail({ message: 'Unauthorized - no session' }), { status: 401 });
    }

    // Fetch notes by topic
    const data = await getNotesByTopic(
      userUuid,
      subjectSlug,
      chapterSlug,
      topicSlug
    );
    console.log('[notes-topic-api] Data fetched for topic:', topicSlug);
    return NextResponse.json(ok(data), { status: 200 });
  } catch (error) {
    console.error('[notes-topic-api] GET error:', error);
    return NextResponse.json(fail(error), { status: 500 });
  }
}

/**
 * POST - Track note access/read
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ subjectSlug: string; chapterSlug: string; topicSlug: string }> }
) {
  try {
    const { topicSlug } = await params;
    const { noteId, action } = await request.json();

    // Authenticate user
    const session = await auth();
    const userUuid = session?.user?.id;
    if (!userUuid) {
      return NextResponse.json(fail({ message: 'Unauthorized - no session' }), { status: 401 });
    }

    if (action === 'track-access') {
      await trackNoteAccess(userUuid, noteId);
    }

    return NextResponse.json(ok({ success: true }), { status: 200 });
  } catch (error) {
    console.error('[notes-topic-api] POST error:', error);
    return NextResponse.json(fail(error), { status: 500 });
  }
}