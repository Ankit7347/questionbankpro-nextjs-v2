/**
 * src/app/dashboard/syllabus/[examId]/[subjectId]/[chapterId]/page.tsx
 * Authored by Architect Pro
 * Persona: Architect Pro (Senior)
 */

'use client'

import React, { useEffect, useState } from 'react'
import { BookOpen, FileText, RefreshCw, Play } from 'lucide-react'

type TopicStatus = 'read' | 'practiced' | 'mastered' | null

interface Topic {
  id: string
  title: string
  status: TopicStatus
}

interface ChapterData {
  id: string
  title: string
  topics: Topic[]
  revisionCount: number
  cheatSheet?: string
}

export default async function ChapterPage({ params }: { params: Promise<{ examId: string; subjectId: string; chapterId: string }> }) {
  const [data, setData] = useState<ChapterData | null>(null)
  const [loading, setLoading] = useState(true)
  const {examId, subjectId, chapterId} = await params;
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/dashboard/syllabus/${examId}/${subjectId}/${chapterId}`)
        const d = await res.json()
        setData(d.chapter || null)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [examId, subjectId, chapterId])

  const toggleTopic = async (topicId: string) => {
    if (!data) return
    const next: TopicStatus = data.topics.find((t) => t.id === topicId)?.status === 'read' ? 'practiced' : 'read'
    await fetch(`/api/dashboard/syllabus/${examId}/${subjectId}/${chapterId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggleTopic', topicId, status: next }),
    })
    setData({ ...data, topics: data.topics.map((t) => (t.id === topicId ? { ...t, status: next } : t)) })
  }

  const incrementRevision = async () => {
    if (!data) return
    const res = await fetch(`/api/dashboard/syllabus/${examId}/${subjectId}/${chapterId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'incrementRevision' }),
    })
    if (res.ok) setData({ ...data, revisionCount: data.revisionCount + 1 })
  }

  if (loading)
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="h-48 rounded-lg bg-slate-900/40 animate-pulse" />
        </div>
      </div>
    )

  if (!data)
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4">
        <div className="max-w-3xl mx-auto">Chapter not found</div>
      </div>
    )

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{data.title}</h1>
            <p className="text-sm text-slate-400">Revision count: {data.revisionCount}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={incrementRevision}
              className="h-12 inline-flex items-center px-3 rounded-md bg-slate-800 text-sm"
              aria-label="Increment revision"
            >
              <RefreshCw size={16} className="mr-2" />
              Revise
            </button>
          </div>
        </header>

        <section className="rounded-lg bg-slate-900/40 p-4">
          <h2 className="text-sm text-slate-300 mb-2">Topics</h2>
          <ul className="space-y-2">
            {data.topics.map((t) => (
              <li key={t.id} className="flex items-center justify-between bg-slate-800 p-3 rounded-md">
                <div>
                  <div className="font-medium">{t.title}</div>
                  <div className="text-xs text-slate-400">Status: {t.status ?? 'Not started'}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleTopic(t.id)}
                    className="h-12 w-12 rounded-md bg-slate-700 flex items-center justify-center"
                    aria-label={`Toggle ${t.title}`}
                  >
                    <BookOpen size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg bg-slate-900/40 p-4">
          <h3 className="text-sm text-slate-300 mb-2">Resources</h3>
          <div className="flex gap-2">
            <a href={`/dashboard/notes?chapter=${data.id}`} className="h-12 inline-flex items-center px-3 rounded-md bg-cyan-400 text-slate-950 text-sm"><FileText size={16} className="mr-2" />Notes</a>
            <a href={`/dashboard/quiz?chapter=${data.id}`} className="h-12 inline-flex items-center px-3 rounded-md bg-emerald-600 text-slate-950 text-sm"><Play size={16} className="mr-2" />Quiz</a>
          </div>
        </section>

        {data.cheatSheet && (
          <section className="rounded-lg bg-slate-900/40 p-4">
            <h3 className="text-sm text-slate-300 mb-2">Cheat Sheet</h3>
            <div className="prose prose-invert text-sm">{data.cheatSheet}</div>
          </section>
        )}
      </div>
    </main>
  )
}