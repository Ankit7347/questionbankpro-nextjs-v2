import { NextRequest,NextResponse } from 'next/server';

export async function GET() {
  const history = [
    { id: '101', title: 'Organic Chemistry', score: 85, date: '2023-10-01', passed: true },
    { id: '102', title: 'Mechanics', score: 40, date: '2023-09-28', passed: false },
  ];
  return NextResponse.json(history);
}