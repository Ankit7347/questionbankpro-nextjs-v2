// src/app/api/dashboard/solved-papers/route.ts

import { NextRequest, NextResponse } from 'next/server';

// --- Response Types ---
interface SolutionStep {
  id: string;
  title?: string;
  body: string;
}

interface SolvedPaper {
  id: string;
  title: string;
  subject: string;
  year: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  views: number;
  isVerified: boolean;
  isPremium?: boolean;
  shortDescription?: string;
  questionCount: number;
  sampleSteps?: SolutionStep[];
}

interface SubjectGroup {
  subject: string;
  papers: SolvedPaper[];
}

interface SolvedPapersResponse {
  stats: { totalSolved: number };
  subjects: SubjectGroup[];
  trending: SolvedPaper[];
}

export async function GET(request: NextRequest) {
  try {
    // Simulate user metadata: check query param or header
    const url = new URL(request.url);
    const premiumQ = url.searchParams.get('premium');
    const isPremium = premiumQ === 'true' || request.headers.get('x-user-premium') === 'true';

    // Mock Data
    const mathSamples: SolvedPaper[] = [
      {
        id: 'm-2024-01',
        title: 'Advanced Calculus - Limits & Series (Solved)',
        subject: 'Mathematics',
        year: '2024',
        difficulty: 'Hard',
        views: 4210,
        isVerified: true,
        isPremium: false,
        shortDescription: 'Step-by-step solutions for limits and infinite series questions from 2024 exam.',
        questionCount: 30,
        sampleSteps: isPremium ? [
          { id: 's1', title: 'Given Data', body: 'Let f(x) = \frac{1}{x^2 + 1}. Find limit as x→∞ $\lim_{x\to\infty} f(x)$' },
          { id: 's2', title: 'Approach', body: 'Use comparison test and known limits. Use substitution $t = 1/x$.' },
          { id: 's3', title: 'Final', body: 'Hence the limit is 0. Final answer: 0. $\boxed{0}$' },
        ] : [
          { id: 's1', body: 'Final result: limit = 0. (Upgrade for detailed math steps)' },
        ],
      },
      {
        id: 'm-2023-02',
        title: 'Linear Algebra - Eigenvalues (Solved)',
        subject: 'Mathematics',
        year: '2023',
        difficulty: 'Medium',
        views: 2281,
        isVerified: false,
        isPremium: true,
        shortDescription: 'Eigenvalue/eigenvector problems with conceptual callouts.',
        questionCount: 22,
        sampleSteps: isPremium ? [
          { id: 's1', title: 'Given', body: 'Matrix A with characteristic polynomial $\chi(\lambda)$' },
          { id: 's2', title: 'Computation', body: 'Compute determinant and solve $\chi(\lambda)=0$' },
        ] : [{ id: 's1', body: 'Premium solution. Please subscribe to view detailed steps.' }],
      },
    ];

    const physicsSamples: SolvedPaper[] = [
      {
        id: 'ph-2024-01',
        title: "Mechanics - Projectile Motion (Solved)",
        subject: 'Physics',
        year: '2024',
        difficulty: 'Medium',
        views: 3130,
        isVerified: true,
        isPremium: false,
        shortDescription: "Breakdown of kinematic equations and energy considerations.",
        questionCount: 18,
        sampleSteps: [{ id: 's1', body: 'Use $s = ut + 1/2 at^2$ and project onto axes.' }],
      },
    ];

    const subjects: SubjectGroup[] = [
      { subject: 'Mathematics', papers: mathSamples },
      { subject: 'Physics', papers: physicsSamples },
      { subject: 'Chemistry', papers: [] },
    ];

    // Trending: top N by views
    const trending = [...mathSamples, ...physicsSamples].sort((a, b) => b.views - a.views).slice(0, 6);

    const response: SolvedPapersResponse = {
      stats: { totalSolved: mathSamples.length + physicsSamples.length },
      subjects,
      trending,
    };

    // Conditional fields: if not premium, hide detailed steps in sample data (already simulated above)

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error in solved-papers route', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
