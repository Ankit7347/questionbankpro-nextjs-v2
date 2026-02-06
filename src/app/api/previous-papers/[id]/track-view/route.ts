// src/app/api/previous-papers/[id]/track-view/route.ts
/**
 * POST /api/previous-papers/[id]/track-view - Track paper view
 */

import { NextRequest, NextResponse } from 'next/server';
import { trackPreviousPaperView } from '@/services/server/previousPaper.server';
import { ok, fail } from '@/lib/response.util';
import { ApiError } from '@/lib/apiError';

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    await trackPreviousPaperView(params.id);
    return NextResponse.json(ok({ tracked: true }), { status: 200 });
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
