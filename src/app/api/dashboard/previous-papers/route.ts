// src/app/api/dashboard/previous-papers/route.ts

import { NextRequest,NextResponse } from 'next/server';

// --- Interfaces ---

interface PreviousPapersResponse {
  stats: {
    totalPapers: number;
    totalDownloads: number;
    activeYears: number;
  };
  years: Array<{
    year: string;
    paperCount: number;
    isActive: boolean;
  }>;
  recentPapers: Array<{
    id: string;
    subject: string;
    code: string;
    year: string;
    session: string;
    dateAdded: string;
  }>;
}

export async function GET(request: NextRequest) {
  try {
    // 1. Session Verification (Mock)
    // In production: const session = await getServerSession(authOptions);
    // if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const isAuthenticated = true; 

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized Access' },
        { status: 401 }
      );
    }

    // 2. Fetch Data (Mock Database Call)
    // const data = await db.previousPapers.findMany(...);
    
    const responseData: PreviousPapersResponse = {
      stats: {
        totalPapers: 1250,
        totalDownloads: 45000,
        activeYears: 12,
      },
      years: [
        { year: '2024', paperCount: 45, isActive: true },
        { year: '2023', paperCount: 120, isActive: true },
        { year: '2022', paperCount: 115, isActive: true },
        { year: '2021', paperCount: 98, isActive: true },
        { year: '2020', paperCount: 85, isActive: true },
        { year: '2019', paperCount: 90, isActive: true },
      ],
      recentPapers: [
        { id: 'p1', subject: 'Advanced Mathematics', code: 'MAT401', year: '2024', session: 'Summer', dateAdded: '2024-05-10' },
        { id: 'p2', subject: 'Data Structures', code: 'CS302', year: '2024', session: 'Summer', dateAdded: '2024-05-09' },
        { id: 'p3', subject: 'Digital Logic', code: 'EE205', year: '2023', session: 'Winter', dateAdded: '2024-05-05' },
      ],
    };

    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    console.error('Error fetching previous papers dashboard:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}