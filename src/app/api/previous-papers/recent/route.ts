// src/app/api/previous-papers/recent/route.ts
/**
 * GET /api/previous-papers/recent - Get recent papers
 */

import { NextRequest, NextResponse } from 'next/server';
import { getRecentPreviousPapers } from '@/services/server/previousPaper.server';
import { ok, fail } from '@/lib/response.util';
import { ApiError } from '@/lib/apiError';

export async function GET(request: NextRequest) {
  try {
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '4');

    const result = await getRecentPreviousPapers(Math.min(limit, 50)); // Max 50
    return NextResponse.json(ok(result), { status: 200 });
  } catch (error: any) {
    console.log('Error fetching recent previous papers:', error);
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
