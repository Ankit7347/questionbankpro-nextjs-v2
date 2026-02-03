/**
 * src/app/api/dashboard/syllabus/[examId]/[subjectId]/[chapterId]/route.ts
 * Authored by Architect Pro
 * Persona: Architect Pro (Senior)
 */

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import User from '@/models/mongoose/User.schema'
import { NotFound } from '@/lib/apiError'

interface Topic {
  id: string
  title: string
  status?: 'read' | 'practiced' | 'mastered' | null
}

interface ChapterData {
  id: string
  title: string
  topics: Topic[]
  revisionCount: number
  cheatSheet?: string
}

export async function GET(req: Request, { params }: { params: any }) {
  try {
    const { chapterId } = (await Promise.resolve(params)) as { examId: string; subjectId: string; chapterId: string }

    await dbConnect()
    const session = await auth()
    const headerUuid = req.headers.get('x-user-id') || undefined
    const userUuid = session?.user?.id || headerUuid
    if (!userUuid) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const user = await User.findOne({ uuid: userUuid, isDeleted: false }).select('_id')
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Mocked chapter data — production should merge resources + user progress
    const chapter: ChapterData = {
      id: chapterId,
      title: `Chapter ${chapterId}`,
      topics: [
        { id: 't1', title: 'Topic 1', status: null },
        { id: 't2', title: 'Topic 2', status: 'read' },
        { id: 't3', title: 'Topic 3', status: 'practiced' },
      ],
      revisionCount: 2,
      cheatSheet: 'Key formulas: a^2 + b^2 = c^2; Important note: Focus on problem solving patterns.',
    }

    // TODO: merge user-topic status using user._id
    return NextResponse.json({ chapter }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: any }) {
  try {
    const { chapterId } = (await Promise.resolve(params)) as { examId: string; subjectId: string; chapterId: string }

    await dbConnect()
    const session = await auth()
    const headerUuid = req.headers.get('x-user-id') || undefined
    const userUuid = session?.user?.id || headerUuid
    if (!userUuid) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const user = await User.findOne({ uuid: userUuid, isDeleted: false }).select('_id')
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const body = await req.json()
    const { action } = body as { action: string }

    if (action === 'toggleTopic') {
      // Persist topic status in DB; demo echoes back
      return NextResponse.json({ ok: true, body })
    }

    if (action === 'incrementRevision') {
      // Persist revision increment; demo echoes
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
