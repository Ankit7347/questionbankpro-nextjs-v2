// src/app/api/solved-papers/[id]/route.ts
/**
 * GET /api/solved-papers/[id] - Get single paper
 * PATCH /api/solved-papers/[id] - Update paper
 * DELETE /api/solved-papers/[id] - Delete paper
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSolvedPaperById, updateSolvedPaper, deleteSolvedPaper } from '@/services/server/solvedPaper.server';
import { ok, fail } from '@/lib/response.util';
import { ApiError } from '@/lib/apiError';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const result = await getSolvedPaperById(params.id);
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
    const userId = 'test-user-id'; // Replace with actual user from auth

    const body = await request.json();
    const result = await updateSolvedPaper(params.id, body, userId);

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
    const userId = 'test-user-id'; // Replace with actual user from auth

    await deleteSolvedPaper(params.id, userId);
    return NextResponse.json(ok(null), { status: 204 });
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
