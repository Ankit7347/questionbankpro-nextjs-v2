// src/app/api/dashboard/notes/[subjectId]/route.ts
import { NextRequest,NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ subjectId: string }> }) {
  try {
    const { subjectId } = await params;

    // Validate subjectId
    if (!['physics', 'chemistry', 'maths'].includes(subjectId)) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }

    // Mock Data
    const chapters = [
      { id: 'thermodynamics', title: 'Thermodynamics', description: 'Heat, work, and energy.', progress: 60, totalTopics: 10, completedTopics: 6 },
      { id: 'kinematics', title: 'Kinematics', description: 'Motion of objects.', progress: 20, totalTopics: 15, completedTopics: 3 },
    ];

    return NextResponse.json({
      subject: subjectId,
      chapters
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' }, { status: 500 }
    );
  }
}