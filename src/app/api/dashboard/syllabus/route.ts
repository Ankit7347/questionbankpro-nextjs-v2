/**
 * src/app/api/dashboard/syllabus/route.ts
 * Authored by Architect Pro
 * Persona: Architect Pro (Senior)
 */

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import User from '@/models/mongoose/User.schema'
import { NotFound } from '@/lib/apiError'

interface Exam {
  id: string
  name: string
  durationMins: number
  totalMarks: number
  passingMarks: number
  subjects: number
  pinned?: boolean
  downloadUrl?: string
}

/**
 * NOTE: Read access is developer-friendly and allowed without auth in non-production.
 * Write operations (pin toggles) require an authenticated user; we resolve the user via session -> uuid -> _id.
 */
async function resolveUserOrNull(req?: Request) {
  await dbConnect()
  try {
    // Prefer an authenticated session, but allow a trusted header (x-user-id) for internal server calls
    const session = await auth()
    const headerUuid = req?.headers.get('x-user-id') || undefined
    const userUuid = session?.user?.id || headerUuid
    if (!userUuid) return null
    const user = await User.findOne({ uuid: userUuid, isDeleted: false }).select('_id')
    return user || null
  } catch (err) {
    console.error('Failed to resolve user', err)
    return null
  }
}

// Mock database helpers (replace with real DB in production)
const mockExams: Exam[] = [
  { id: 'jee', name: 'JEE Main', durationMins: 180, totalMarks: 300, passingMarks: 90, subjects: 3, pinned: false },
  { id: 'neet', name: 'NEET', durationMins: 180, totalMarks: 720, passingMarks: 180, subjects: 4, pinned: true },
  { id: 'upsc', name: 'UPSC Prelims', durationMins: 120, totalMarks: 200, passingMarks: 66, subjects: 2, pinned: false },
]

export async function GET(req: Request) {
  try {
    // req.url may be relative when called from internal server fetch; prefer user-provided env vars.
    const envBase =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '') : undefined) ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.VERCEL_URL ||
      'http://localhost:3000'

    const url = req.url.startsWith('http') ? new URL(req.url) : new URL(req.url, envBase)
    const download = url.searchParams.get('download')

    // Resolve user if available (optional for read). Allow header fallback when request is internal.
    const resolvedUser = await resolveUserOrNull(req)

    if (download) {
      // In a real system this would stream a PDF. For now return metadata
      return NextResponse.json({ message: 'PDF generation not implemented in demo' })
    }

    // Merge exam data with user pins (mock behavior). If we have a user, we could inject user-specific fields.
    const exams = mockExams.map((e) => ({ ...e }))
    if (resolvedUser) {
      // Example: nothing persisted here, but spot available for merging pin state
    }

    return NextResponse.json({ exams }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    // Strict write permission: require authenticated session or header-provided user for internal calls
    const user = await resolveUserOrNull(req)
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const { examId, action } = body as { examId: string; action: string }
    const exam = mockExams.find((e) => e.id === examId)
    if (!exam) return NextResponse.json({ error: 'Not Found' }, { status: 404 })

    if (action === 'togglePin') {
      exam.pinned = !exam.pinned
      // In production, persist pin under user._id
      return NextResponse.json({ pinned: exam.pinned })
    }

    return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
