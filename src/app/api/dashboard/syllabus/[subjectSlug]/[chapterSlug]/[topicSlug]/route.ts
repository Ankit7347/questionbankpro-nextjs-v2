import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ subjectSlug: string; chapterSlug: string; topicSlug: string }> }
) {
  const { subjectSlug, chapterSlug, topicSlug } = await params
  // TODO: Fetch content for the topic from database
  return NextResponse.json({ success: true, data: {} })
}