// src/app/api/dashboard/notes/[subjectId]/[chapterId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getNotesByChapter } from '@/services/server/notes.server';
import { ok, fail } from '@/lib/response.util';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ subjectId: string; chapterId: string }> }
) {
  try {
    const { subjectId, chapterId } = await params;

    // Authenticate user
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(fail({ message: 'Unauthorized' }), { status: 401 });
    }

    // Fetch notes by chapter
    const data = await getNotesByChapter(session.user.id, subjectId, chapterId);

    return NextResponse.json(ok(data), { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(fail(error), { status: 500 });
  }
}