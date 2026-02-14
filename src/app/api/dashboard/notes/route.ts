// src/app/api/dashboard/notes/route.ts
import { NextRequest,NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { getProgress } from '@/services/server/progress.service';
import { logActivity } from '@/services/server/activityLog.service';

interface NotesOverviewResponse {
  subjects: {
    id: string;
    name: string;
    totalNotes: number;
    progress: number;
  }[];
  stats: {
    totalNotes: number;
    totalSubjects: number;
  };
}

export async function GET(req: NextRequest) {
  try {
    // authenticate user
    const session = await auth();
    const headerUuid = req.headers.get('x-user-id') || undefined;
    const userUuid = session?.user?.id || headerUuid;
    await dbConnect();
    if (!userUuid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // log overview call
    logActivity(userUuid, 'notes_overview', {});

    const progressRecords = await getProgress(userUuid);
    const subjectsMap: Record<string, any> = {};
    progressRecords.forEach((rec: any) => {
      if (!rec.subjectId) return;
      if (!subjectsMap[rec.subjectId]) {
        subjectsMap[rec.subjectId] = { id: rec.subjectId, name: rec.subjectId, totalNotes: 0, progress: rec.progress };
      } else {
        subjectsMap[rec.subjectId].progress = Math.max(subjectsMap[rec.subjectId].progress, rec.progress);
      }
    });

    const subjects = Object.values(subjectsMap);
    const stats = {
      totalNotes: subjects.reduce((acc: number, s: any) => acc + (s.totalNotes || 0), 0),
      totalSubjects: subjects.length,
    };

    const response: NotesOverviewResponse = { subjects, stats };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch notes overview.' },
      { status: 500 }
    );
  }
}