import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ subjectSlug: string; chapterSlug: string }> }
) {
  const { subjectSlug, chapterSlug } = await params
  // TODO: Fetch topics for the chapter from database
  return NextResponse.json({ success: true, data: [] })
}