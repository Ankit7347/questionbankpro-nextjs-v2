import { NextRequest,NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ quizId: string }> }) {
  // Calculate score or fetch from DB
  return NextResponse.json({
    score: 85,
    correct: 17,
    incorrect: 3,
    skipped: 0
  });
}