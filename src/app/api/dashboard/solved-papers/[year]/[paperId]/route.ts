// src/app/api/dashboard/solved-papers/[year]/[paperId]/route.ts

import { NextRequest, NextResponse } from 'next/server';

interface SolutionStep {
  id: string;
  title?: string;
  body: string;
  callout?: string;
}

interface PaperDetail {
  id: string;
  title: string;
  subject: string;
  year: string;
  isVerified: boolean;
  isPremium?: boolean;
  videoLink?: string;
  questions: Array<{ qid: string; questionText: string }>;
  solutionSteps: SolutionStep[];
  conclusion?: string;
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const parts = url.pathname.split('/').filter(Boolean);
    const paperId = parts.at(-1) ?? '';
    const year = parts.at(-2) ?? '';

    // Simulate premium based on header or query param
    const isPremium = url.searchParams.get('premium') === 'true' || request.headers.get('x-user-premium') === 'true';

    // Mock paper data; in production fetch from DB
    const paper: PaperDetail = {
      id: paperId,
      title: 'Advanced Calculus - Limits & Series (Solved)',
      subject: 'Mathematics',
      year,
      isVerified: true,
      isPremium: paperId.includes('m') && !isPremium ? true : false, // hint: some papers are premium
      videoLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      questions: [
        { qid: 'q1', questionText: 'Find the limit: lim_{x→∞} \frac{1}{x^2 + 1}.' },
        { qid: 'q2', questionText: 'Evaluate the convergence of the series ∑_{n=1}^∞ 1/n^2.' },
      ],
      solutionSteps: isPremium ? [
        { id: 's1', title: 'Given Data', body: 'Let f(x) = \frac{1}{x^2 + 1}. Find $\lim_{x\to\infty} f(x)$' },
        { id: 's2', title: 'Approach', body: 'Use substitution $t = 1/x$ and apply limit theorems. Show steps.' },
        { id: 's3', title: 'Final', body: 'Hence the limit is 0. Final answer: $\boxed{0}$' },
      ] : [
        { id: 's1', body: 'Summary: Limit = 0. Upgrade for detailed steps.' }
      ],
      conclusion: isPremium ? '0 (detailed derivation shown above)' : '0 (brief)'
    };

    return NextResponse.json({ paper }, { status: 200 });
  } catch (error) {
    console.error('Error in solved-papers paper route', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
