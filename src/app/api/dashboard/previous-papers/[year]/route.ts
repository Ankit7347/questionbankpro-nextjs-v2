// src/app/api/dashboard/previous-papers/[year]/route.ts

import { NextRequest,NextResponse } from 'next/server';

// --- Interfaces ---

interface SubjectPaper {
  id: string;
  subjectName: string;
  subjectCode: string;
  session: 'Summer' | 'Winter';
  type: 'Mid-term' | 'Finals';
  downloadCount: number;
}

interface YearResponse {
  year: string;
  papers: SubjectPaper[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ year: string }> }
) {
  try {
    const { year } = await params;

    // 1. Session Verification (Mock)
    const isAuthenticated = true;
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized Access' },
        { status: 401 }
      );
    }

    // 2. Fetch Data (Mock)
    // In production: await db.papers.findMany({ where: { year } });
    
    const mockPapers: SubjectPaper[] = [
      { id: 'p1', subjectName: 'Advanced Mathematics', subjectCode: 'MAT401', session: 'Summer', type: 'Finals', downloadCount: 120 },
      { id: 'p2', subjectName: 'Data Structures', subjectCode: 'CS302', session: 'Summer', type: 'Finals', downloadCount: 340 },
      { id: 'p3', subjectName: 'Digital Logic', subjectCode: 'EE205', session: 'Winter', type: 'Finals', downloadCount: 89 },
      { id: 'p4', subjectName: 'Physics II', subjectCode: 'PHY102', session: 'Winter', type: 'Mid-term', downloadCount: 56 },
      { id: 'p5', subjectName: 'Software Engineering', subjectCode: 'CS405', session: 'Summer', type: 'Mid-term', downloadCount: 210 },
    ];

    const response: YearResponse = {
      year,
      papers: mockPapers,
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error(`Error fetching papers for year:`, error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}