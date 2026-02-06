// src/app/api/previous-papers/year/[year]/route.ts
/**
 * GET /api/previous-papers/year/[year] - Get papers by year
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPreviousPapersByYear } from '@/services/server/previousPaper.server';
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
        fail('Invalid year'),
        { status: 400 }
      );
    }

    const result = await getPreviousPapersByYear(year);
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
