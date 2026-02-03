/**
 * src/app/api/dashboard/syllabus/[examId]/[subjectId]/route.ts
 * Authored by Architect Pro
 * Persona: Architect Pro (Senior)
 */

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import User from '@/models/mongoose/User.schema'
import { NotFound } from '@/lib/apiError'

interface Chapter {
  id: string
  title: string
  topicCount: number
  estimatedMinutes: number
  highYield?: boolean
  prerequisite?: string | null
  progressPercent?: number
}

interface SubjectDetail {
  id: string
  name: string
  progressPercent: number
  chapters: Chapter[]
}

export async function GET(req: Request, { params }: { params: any }) {
  try {
    const { examId, subjectId } = (await Promise.resolve(params)) as { examId: string; subjectId: string }

    await dbConnect()
    const session = await auth()
    const headerUuid = req.headers.get('x-user-id') || undefined
    const userUuid = session?.user?.id || headerUuid
    if (!userUuid) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const user = await User.findOne({ uuid: userUuid, isDeleted: false }).select('_id')
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Mock response: In production, aggregate syllabus + user progress here
    const subject: SubjectDetail = {
      id: subjectId,
      name: `${subjectId.toUpperCase()} (${examId.toUpperCase()})`,
      progressPercent: Math.floor(Math.random() * 80),
      chapters: [
        { id: 'ch1', title: 'Fundamentals', topicCount: 10, estimatedMinutes: 120, highYield: true, prerequisite: null, progressPercent: 60 },
        { id: 'ch2', title: 'Advanced Concepts', topicCount: 8, estimatedMinutes: 100, highYield: false, prerequisite: 'ch1', progressPercent: 20 },
      ],
    }

    // In production: merge user progress using user._id
    return NextResponse.json({ subject }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: any }) {
  try {
    const { examId, subjectId } = (await Promise.resolve(params)) as { examId: string; subjectId: string }

    await dbConnect()
    const session = await auth()
    const headerUuid = req.headers.get('x-user-id') || undefined
    const userUuid = session?.user?.id || headerUuid
    if (!userUuid) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const user = await User.findOne({ uuid: userUuid, isDeleted: false }).select('_id')
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const body = await req.json()
    // Example actions: updateChapterProgress, etc. For demo, we echo back
    return NextResponse.json({ ok: true, body })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
