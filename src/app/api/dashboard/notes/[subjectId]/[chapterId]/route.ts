// src/app/api/dashboard/notes/[subjectId]/[chapterId]/route.ts
import { NextRequest,NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ subjectId: string; chapterId: string }> }) {
  try {
    const { chapterId } = await params;

    // Mock Data
    const topics = [
      { id: 'intro', title: 'Introduction to Thermodynamics', difficulty: 'Easy', readTime: '5 min', isCompleted: true },
      { id: 'laws', title: 'Laws of Thermodynamics', difficulty: 'Moderate', readTime: '12 min', isCompleted: false },
    ];

    return NextResponse.json({
      chapter: chapterId,
      topics
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}