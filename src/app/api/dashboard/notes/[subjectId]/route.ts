// src/app/api/dashboard/notes/[subjectId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getNotesBySubject } from '@/services/server/notes.server';
import { ok, fail } from '@/lib/response.util';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ subjectId: string }> }
) {
  try {
    const { subjectId } = await params;

    // Authenticate user
    const session = await auth();
    const headerUuid = request.headers.get('x-user-id') || undefined;
    const userUuid = session?.user?.id || headerUuid;

    if (!userUuid) {
      return NextResponse.json(fail({ message: 'Unauthorized' }), { status: 401 });
    }

    // Fetch notes by subject
    const data = await getNotesBySubject(userUuid, subjectId);

    return NextResponse.json(ok(data), { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(fail(error), { status: 500 });
  }
}