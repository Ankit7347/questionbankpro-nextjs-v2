import { NextRequest,NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ quizId: string }> }) {
  // Mock details
  const {quizId} = await params;
  return NextResponse.json({
    id: quizId,
    title: 'Physics Mid-Term',
    duration: 30,
    questions: 20,
    negativeMarking: 0.25
  });
}