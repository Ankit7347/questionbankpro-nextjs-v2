import { NextRequest,NextResponse } from 'next/server';

export async function GET() {
  // Mock data for dashboard
  const data = {
    stats: {
      averageScore: 78,
      completed: 12,
      rank: 42
    },
    categories: ['Physics', 'Math', 'Chemistry', 'Biology']
  };
  return NextResponse.json(data);
}