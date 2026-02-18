// src/app/api/dashboard/notes/[subjectId]/[chapterId]/[topicId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getNotesByTopic, trackNoteAccess } from '@/services/server/notes.server';
import { ok, fail } from '@/lib/response.util';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ subjectId: string; chapterId: string; topicId: string }> }
) {
  try {
    const { subjectId, chapterId, topicId } = await params;

    // Authenticate user
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(fail({ message: 'Unauthorized' }), { status: 401 });
    }

    // Fetch notes by topic
    const data = await getNotesByTopic(
      session.user.id,
      subjectId,
      chapterId,
      topicId
    );

    return NextResponse.json(ok(data), { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(fail(error), { status: 500 });
  }
}

/**
 * POST - Track note access/read
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ subjectId: string; chapterId: string; topicId: string }> }
) {
  try {
    const { subjectId, chapterId, topicId } = await params;
    const { noteId, action } = await request.json();

    // Authenticate user
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(fail({ message: 'Unauthorized' }), { status: 401 });
    }

    if (action === 'track-access') {
      await trackNoteAccess(session.user.id, noteId);
    }

    return NextResponse.json(ok({ success: true }), { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(fail(error), { status: 500 });
  }
}