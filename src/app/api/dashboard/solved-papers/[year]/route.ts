// src/app/api/dashboard/solved-papers/[year]/route.ts

import { NextRequest, NextResponse } from 'next/server';

interface PaperSummary {
  id: string;
  title: string;
  subject: string;
  year: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionCount: number;
  views: number;
  isVerified?: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    // path expected: /api/dashboard/solved-papers/{year}
    const parts = url.pathname.split('/').filter(Boolean);
    const year = parts.at(-1) ?? 'unknown';

    // Mock dataset: in production this would be a DB call
    const mockPapers: PaperSummary[] = [
      {
        id: `${year}-m-01`,
        title: 'Advanced Calculus - Limits & Series (Solved)',
        subject: 'Mathematics',
        year,
        difficulty: 'Hard',
        questionCount: 30,
        views: 4210,
        isVerified: true,
      },
      {
        id: `${year}-ph-01`,
        title: 'Mechanics - Projectile Motion (Solved)',
        subject: 'Physics',
        year,
        difficulty: 'Medium',
        questionCount: 18,
        views: 3130,
        isVerified: true,
      },
      {
        id: `${year}-ch-01`,
        title: 'Organic Chemistry - Reaction Mechanisms (Solved)',
        subject: 'Chemistry',
        year,
        difficulty: 'Medium',
        questionCount: 20,
        views: 1200,
        isVerified: false,
      },
    ];

    const metrics = {
      avgDifficulty: 'Medium',
      solvedCount: mockPapers.length,
    };

    return NextResponse.json({ papers: mockPapers, metrics }, { status: 200 });
  } catch (error) {
    console.error('Error in solved-papers year route', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
