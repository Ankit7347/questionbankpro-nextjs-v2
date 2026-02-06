// src/app/api/solved-papers/stats/route.ts
/**
 * GET /api/solved-papers/stats - Get dashboard stats
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSolvedPapersStats } from '@/services/server/solvedPaper.server';
import { ok, fail } from '@/lib/response.util';
import { ApiError } from '@/lib/apiError';

export async function GET(request: NextRequest) {
  try {
    const result = await getSolvedPapersStats();
    return NextResponse.json(ok(result), { status: 200 });
  } catch (error: any) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        fail(error.message),
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      fail('Internal server error'),
      { status: 500 }
    );
  }
}
