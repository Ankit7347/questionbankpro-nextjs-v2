/**
 * src/app/dashboard/syllabus/[examId]/page.tsx
 * Authored by Architect Pro
 * Persona: Architect Pro (Senior)
 */

import React from 'react'
import { Download } from 'lucide-react'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import User from '@/models/mongoose/User.schema'
import { NotFound } from '@/lib/apiError'
import Link from 'next/link'

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

export default async function ExamPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params;

  // Enforce authenticated dashboard access and resolve user for personalized progress
  await dbConnect()
  const session = await auth()
  const userUuid = session?.user?.id
  const subExamId = session?.user?.subExamId
  if (!userUuid) throw NotFound('User not authenticated')
  const user = await User.findOne({ uuid: userUuid, isDeleted: false }).select('_id')
  if (!user) throw NotFound('User not found')

  const apiBase = process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api`
  const res = await fetch(`${apiBase}/dashboard/syllabus/${examId}`, { cache: 'no-store', headers: { 'x-user-id': userUuid } })
  const data: { exam?: ExamDetail } = await res.json()
  const exam = data.exam

  // Breadcrumb makes navigation discoverable
  const Breadcrumb = () => (
    <nav className="text-sm text-slate-400 mb-2">
      <Link href="/dashboard/syllabus" className="hover:text-cyan-400">Syllabus</Link>
      <span className="mx-2 text-slate-500">/</span>
      <span className="text-slate-200">{exam?.name}</span>
    </nav>
  )

  if (!exam) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
        <div className="max-w-4xl mx-auto">Exam not found</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <header className="flex items-center justify-between mb-4">
            <div>
              <Breadcrumb />
              <h1 className="text-2xl font-semibold">{exam.name}</h1>
              <p className="text-sm text-slate-400">{exam.subjects?.length ?? 0} subjects • {exam.durationMins} mins</p>
            </div>
            <a
              href={exam.downloadUrl || `/api/dashboard/syllabus/${exam.id}?download=1`}
              className="h-12 inline-flex items-center px-3 rounded-md bg-emerald-600 text-sm"
            >
              <Download size={16} className="mr-2" />
              Download Syllabus
            </a>
          </header>

          <div className="mb-6 rounded-lg bg-slate-900/40 p-4">
            <h3 className="text-sm text-slate-300 mb-2">Subject Distribution</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {exam.subjects.map((s) => (
                <div key={s.id} className="p-3 rounded-md bg-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{s.name}</h4>
                    <p className="text-xs text-slate-400">{s.topicCount} topics • ~{s.estimatedMinutes} mins</p>
                  </div>
                  <div className="text-xs text-amber-400">{s.weightage}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm text-slate-300">Subjects</h3>
            {exam.subjects.map((s) => (
              <article key={s.id} className="p-4 rounded-lg bg-slate-900/40 flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{s.name}</h4>
                  <p className="text-xs text-slate-400">{s.topicCount} topics • Est. {s.estimatedMinutes} mins</p>
                </div>
                <a
                  href={`/dashboard/syllabus/${exam.id}/${s.id}`}
                  className="h-12 inline-flex items-center px-3 rounded-md bg-cyan-400 text-slate-950 text-sm"
                >
                  View
                </a>
              </article>
            ))}
          </div>
        </section>

        <aside className="rounded-lg bg-slate-900/40 p-4">
          <h3 className="text-sm text-slate-300">Exam Metadata</h3>
          <ul className="mt-3 text-sm text-slate-400 space-y-2">
            <li>Duration: {exam.durationMins} minutes</li>
            <li>Total Marks: {exam.totalMarks}</li>
            <li>Passing Marks: {exam.passingMarks}</li>
          </ul>
        </aside>
      </div>
    </main>
  )
}