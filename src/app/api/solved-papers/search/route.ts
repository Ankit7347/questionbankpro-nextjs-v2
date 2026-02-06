// src/app/api/solved-papers/search/route.ts
/**
 * GET /api/solved-papers/search - Search papers
 */

import { NextRequest, NextResponse } from 'next/server';
import { searchSolvedPapers } from '@/services/server/solvedPaper.server';
import { ok, fail } from '@/lib/response.util';
import { ApiError } from '@/lib/apiError';

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get('q');
    if (!query) {
      return NextResponse.json(
        fail('Search query required'),
        { status: 400 }
      );
    }

    const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
    const result = await searchSolvedPapers(query, page);

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
