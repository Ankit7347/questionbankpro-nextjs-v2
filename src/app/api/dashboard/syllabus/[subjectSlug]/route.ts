import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ subjectSlug: string }> }
) {
  const { subjectSlug } = await params
  // TODO: Fetch chapters for the subject from database
  return NextResponse.json({ success: true, data: [] })
}