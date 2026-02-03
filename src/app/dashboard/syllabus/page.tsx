/**
 * src/app/dashboard/syllabus/page.tsx
 * Authored by Architect Pro
 * Persona: Architect Pro (Senior)
 */

'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Download, Pin } from 'lucide-react'

interface ExamTile {
  id: string
  name: string
  durationMins: number
  totalMarks: number
  passingMarks: number
  subjects: number
  pinned?: boolean
  downloadUrl?: string
}

export default function SyllabusPage(){
  const [exams, setExams] = useState<ExamTile[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/dashboard/syllabus')
        const data = await res.json()
        setExams(data.exams || [])
      } catch (err) {
        console.error('Failed to load exams', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const pinned = exams.filter((e) => e.pinned)
  const list = exams.filter(
    (e) => e.name.toLowerCase().includes(query.toLowerCase()) || pinned.includes(e)
  )

  const togglePin = async (examId: string) => {
    try {
      const res = await fetch('/api/dashboard/syllabus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examId, action: 'togglePin' }),
      })
      if (!res.ok) throw new Error('Pin failed')
      const data = await res.json()
      setExams((prev) => prev.map((p) => (p.id === examId ? { ...p, pinned: data.pinned } : p)))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">Syllabus</h1>
            <p className="text-sm text-slate-400">Your roadmap — exams, subjects & topics</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => (window.location.href = '/api/dashboard/syllabus?download=1')}
              className="flex items-center gap-2 bg-slate-900/40 hover:bg-slate-800/60 rounded-lg px-3 h-12"
            >
              <Download size={16} />
              <span className="text-sm">Download Catalog</span>
            </button>
          </div>
        </header>

        <div className="mb-4">
          <label className="relative block">
            <span className="sr-only">Search exams</span>
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={16} className="text-slate-400" />
            </span>
            <input
              className="pl-10 pr-4 py-3 w-full rounded-lg bg-slate-900/40 placeholder:text-slate-500 text-sm"
              placeholder="Search exams (JEE, NEET, University, UPSC...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>

        {loading ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-36 rounded-lg bg-slate-900/40 animate-pulse" />
            ))}
          </section>
        ) : (
          <section className="space-y-6">
            {pinned.length > 0 && (
              <div>
                <h2 className="text-sm text-cyan-400 mb-2">My Exams</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pinned.map((exam) => (
                    <article
                      key={exam.id}
                      className="p-4 rounded-lg bg-slate-900/40 flex items-center justify-between"
                    >
                      <Link href={`/dashboard/syllabus/${exam.id}`} className="flex-1 pr-3">
                        <div>
                          <h3 className="font-medium">{exam.name}</h3>
                          <p className="text-xs text-slate-400">{exam.subjects} subjects • {exam.durationMins} mins</p>
                        </div>
                      </Link>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => togglePin(exam.id)}
                          aria-label="Unpin exam"
                          className="h-12 w-12 rounded-md flex items-center justify-center bg-slate-800"
                        >
                          <Pin size={16} className="text-cyan-400" />
                        </button>
                        <Link href={`/dashboard/syllabus/${exam.id}`} className="h-12 inline-flex items-center px-3 rounded-md bg-cyan-400 text-slate-950 text-sm">View</Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )} 

            <h2 className="text-sm text-slate-300">All Exams</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {list.map((exam) => (
                <article key={exam.id} className="rounded-lg p-4 bg-slate-900/40">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{exam.name}</h3>
                      <p className="text-xs text-slate-400">{exam.subjects} subjects • {exam.totalMarks} marks</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => togglePin(exam.id)}
                        className="h-12 w-12 rounded-md flex items-center justify-center bg-slate-800"
                      >
                        <Pin size={16} className={exam.pinned ? 'text-cyan-400' : 'text-slate-400'} />
                      </button>
                      <Link href={`/dashboard/syllabus/${exam.id}`} className="h-12 inline-flex items-center px-3 rounded-md bg-cyan-400 text-slate-950 text-sm">View</Link>
                      <a
                        href={exam.downloadUrl || `/api/dashboard/syllabus/${exam.id}?download=1`}
                        className="h-12 inline-flex items-center px-3 rounded-md bg-emerald-600 text-sm"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}