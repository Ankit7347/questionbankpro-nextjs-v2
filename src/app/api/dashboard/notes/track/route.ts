// src/app/api/dashboard/notes/track/route.ts
/**
 * POST /api/dashboard/notes/track
 * ===============================
 * Track note access and engagement
 * Body: { noteId, action: 'access' | 'time-spent', timeSpent?: number }
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { trackNoteAccess, updateNoteTimeSpent } from '@/services/server/notes.server';
import { ok, fail } from '@/lib/response.util';

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(fail({ message: 'Unauthorized' }), { status: 401 });
    }

    const { noteId, action, timeSpent } = await req.json();

    if (!noteId) {
      return NextResponse.json(fail({ message: 'noteId is required' }), { status: 400 });
    }

    if (action === 'access') {
      await trackNoteAccess(session.user.id, noteId);
    } else if (action === 'time-spent' && typeof timeSpent === 'number') {
      await updateNoteTimeSpent(session.user.id, noteId, timeSpent);
    } else {
      return NextResponse.json(
        fail({ message: 'Invalid action or missing timeSpent' }),
        { status: 400 }
      );
    }

    return NextResponse.json(ok({ success: true }), { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(fail(error), { status: 500 });
  }
}
