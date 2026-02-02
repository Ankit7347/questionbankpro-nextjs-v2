import { NextRequest,NextResponse } from 'next/server';

export async function GET() {
  const upcoming = [
    { id: '1', title: 'Physics Mid-Term', startTime: new Date(Date.now() + 7200000).toISOString(), registered: true },
    { id: '2', title: 'Calculus I', startTime: new Date(Date.now() + 86400000).toISOString(), registered: false },
  ];
  return NextResponse.json(upcoming);
}