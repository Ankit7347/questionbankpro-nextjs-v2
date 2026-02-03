/**
 * src/app/api/dashboard/syllabus/[examId]/route.ts
 * Authored by Architect Pro
 * Persona: Architect Pro (Senior)
 */

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import User from '@/models/mongoose/User.schema'
import { NotFound } from '@/lib/apiError'

interface SubjectSummary {
  id: string
  name: string
  topicCount: number
  estimatedMinutes: number
  weightage: number
}

interface ExamDetail {
  id: string
  name: string
  durationMins: number
  totalMarks: number
  passingMarks: number
  subjects: SubjectSummary[]
  downloadUrl?: string
}

// Mock data
const mockExams: Record<string, ExamDetail> = {
  jee: {
    id: 'jee',
    name: 'JEE Main',
    durationMins: 180,
    totalMarks: 300,
    passingMarks: 90,
    downloadUrl: '/static/syllabus/jee.pdf',
    subjects: [
      { id: 'phy', name: 'Physics', topicCount: 45, estimatedMinutes: 600, weightage: 33 },
      { id: 'chem', name: 'Chemistry', topicCount: 38, estimatedMinutes: 540, weightage: 34 },
      { id: 'math', name: 'Mathematics', topicCount: 50, estimatedMinutes: 720, weightage: 33 },
    ],
  },
}

export async function GET(req: Request, { params }: { params: Promise<{ examId: string }> }) {
  try {
    const { examId } = await params;

    await dbConnect()
    // Prefer a session, but allow the request to pass a trusted x-user-id header for internal server-to-server calls
    const session = await auth()
    const headerUuid = req.headers.get('x-user-id') || undefined
    const userUuid = session?.user?.id || headerUuid
    console.log('Resolved user UUID:', userUuid ?? null)
    if (!userUuid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const user = await User.findOne({ uuid: userUuid, isDeleted: false }).select('_id')
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const exam = mockExams[examId]
    if (!exam) return NextResponse.json({ error: 'Not Found' }, { status: 404 })

    // TODO: Merge user progress into subject summaries here using user._id
    return NextResponse.json({ exam }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
