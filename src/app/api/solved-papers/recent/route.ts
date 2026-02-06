// src/app/api/solved-papers/recent/route.ts
/**
 * GET /api/solved-papers/recent - Get recent papers
 */

import { NextRequest, NextResponse } from 'next/server';
import { getRecentSolvedPapers } from '@/services/server/solvedPaper.server';
import { ok, fail } from '@/lib/response.util';
import { ApiError } from '@/lib/apiError';

export async function GET(request: NextRequest) {
  try {
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '4');
    const result = await getRecentSolvedPapers(limit);

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
