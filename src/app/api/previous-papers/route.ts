// src/app/api/previous-papers/route.ts
/**
 * GET /api/previous-papers - List all papers
 * POST /api/previous-papers - Create new paper
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPreviousPapers, createPreviousPaper } from '@/services/server/previousPaper.server';
import { ok, fail } from '@/lib/response.util';
import { ApiError } from '@/lib/apiError';

export async function GET(request: NextRequest) {
  try {
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20');
    const year = request.nextUrl.searchParams.get('year');
    const examId = request.nextUrl.searchParams.get('examId');
    const subjectId = request.nextUrl.searchParams.get('subjectId');
    const difficulty = request.nextUrl.searchParams.get('difficulty');

    const filters = {
      year: year ? parseInt(year) : undefined,
      examId: examId || undefined,
      subjectId: subjectId || undefined,
      difficulty: difficulty || undefined,
    };

    const result = await getPreviousPapers(page, limit, filters);
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

export async function POST(request: NextRequest) {
  try {
    // TODO: Add auth check
    const userId = 'test-user-id'; // Replace with actual user from auth

    const body = await request.json();
    const result = await createPreviousPaper(body, userId);

    return NextResponse.json(ok(result), { status: 201 });
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
