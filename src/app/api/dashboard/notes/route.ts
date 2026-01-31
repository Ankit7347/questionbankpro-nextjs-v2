// src/app/api/dashboard/notes/route.ts
import { NextResponse } from 'next/server';

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

export async function GET() {
  try {
    // Mock database fetch logic
    const subjects = [
      { id: 'physics', name: 'Physics', totalNotes: 120, progress: 45 },
      { id: 'chemistry', name: 'Chemistry', totalNotes: 95, progress: 30 },
      { id: 'maths', name: 'Mathematics', totalNotes: 150, progress: 60 },
    ];

    const stats = {
      totalNotes: subjects.reduce((acc, s) => acc + s.totalNotes, 0),
      totalSubjects: subjects.length,
    };

    const response: NotesOverviewResponse = {
      subjects,
      stats,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch notes overview.' },
      { status: 500 }
    );
  }
}