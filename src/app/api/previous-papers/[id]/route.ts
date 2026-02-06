// src/app/api/previous-papers/[id]/route.ts
/**
 * GET /api/previous-papers/[id] - Get single paper
 * PATCH /api/previous-papers/[id] - Update paper
 * DELETE /api/previous-papers/[id] - Delete paper
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getPreviousPaperById,
  updatePreviousPaper,
  deletePreviousPaper,
} from '@/services/server/previousPaper.server';
import { ok, fail } from '@/lib/response.util';
import { ApiError } from '@/lib/apiError';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const result = await getPreviousPaperById(params.id);
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

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    // TODO: Add auth check
    const userId = 'test-user-id';

    const body = await request.json();
    const result = await updatePreviousPaper(params.id, body, userId);

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

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    // TODO: Add auth check
    const userId = 'test-user-id';

    await deletePreviousPaper(params.id, userId);

    return NextResponse.json(ok({ success: true }), { status: 200 });
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
