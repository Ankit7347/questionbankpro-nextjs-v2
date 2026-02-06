// src/app/api/solved-papers/year/[year]/route.ts
/**
 * GET /api/solved-papers/year/[year] - Get papers by year
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSolvedPapersByYear } from '@/services/server/solvedPaper.server';
import { ok, fail } from '@/lib/response.util';
import { ApiError } from '@/lib/apiError';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ year: string }> }
) {
  const params = await props.params;
  try {
    const year = parseInt(params.year);
    if (isNaN(year)) {
      return NextResponse.json(
        fail('Invalid year format'),
        { status: 400 }
      );
    }

    const result = await getSolvedPapersByYear(year);
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
