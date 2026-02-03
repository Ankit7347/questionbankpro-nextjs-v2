/**
 * src/app/dashboard/syllabus/[examId]/[subjectId]/page.tsx
 * Authored by Architect Pro
 * Persona: Architect Pro (Senior)
 */

import React from 'react'
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

export default async function SubjectPage({ params }: { params: Promise<{ examId: string; subjectId: string }> }) {
  const { examId, subjectId } = await params;
  // Enforce authenticated dashboard access and resolve user for personalized progress
  await dbConnect()
  const session = await auth()
  const userUuid = session?.user?.id
  const subExamId = session?.user?.subExamId
  if (!userUuid) throw NotFound('User not authenticated')
  const user = await User.findOne({ uuid: userUuid, isDeleted: false }).select('_id')
  if (!user) throw NotFound('User not found')

  const apiBase = process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api`
  const res = await fetch(`${apiBase}/dashboard/syllabus/${examId}/${subjectId}`, { cache: 'no-store', headers: { 'x-user-id': userUuid } })
  const data: { subject?: SubjectDetail } = await res.json()
  const subject = data.subject

  if (!subject) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
        <div className="max-w-4xl mx-auto">Subject not found</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-4">
          <h1 className="text-2xl font-semibold">{subject.name}</h1>
          <p className="text-sm text-slate-400">Progress: {subject.progressPercent}%</p>
        </header>

        <div className="rounded-lg bg-slate-900/40 p-4 mb-4">
          <div className="w-full bg-slate-800 rounded h-3 overflow-hidden">
            <div style={{ width: `${subject.progressPercent}%` }} className="h-3 bg-emerald-500" />
          </div>
        </div>

        <div className="space-y-3">
          {subject.chapters.map((ch) => (
            <article key={ch.id} className="p-3 rounded-md bg-slate-900/40 flex items-center justify-between">
              <div>
                <h3 className="font-medium">{ch.title}</h3>
                <p className="text-xs text-slate-400">{ch.topicCount} topics • ~{ch.estimatedMinutes} mins</p>
                <div className="mt-2 flex gap-2 text-xs">
                  {ch.highYield && <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950">High Yield</span>}
                  {ch.prerequisite && <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-200">Prereq: {ch.prerequisite}</span>}
                </div>
              </div>
              <a href={`/dashboard/syllabus/${examId}/${subjectId}/${ch.id}`} className="h-12 inline-flex items-center px-3 rounded-md bg-cyan-400 text-slate-950 text-sm">Open</a>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}