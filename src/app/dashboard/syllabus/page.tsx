// src/app/dashboard/syllabus/page.tsx

'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Download, Pin, Clock, BookOpen, ChevronRight } from 'lucide-react'

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

export default function SyllabusPage() {
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
    (e) => e.name.toLowerCase().includes(query.toLowerCase())
  )

  const togglePin = async (examId: string) => {
    // Optimistic update
    setExams((prev) =>
      prev.map((p) => (p.id === examId ? { ...p, pinned: !p.pinned } : p))
    )
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
      // Revert on failure
      setExams((prev) =>
        prev.map((p) => (p.id === examId ? { ...p, pinned: !p.pinned } : p))
      )
    }
  }

  return (
    <main className="p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              Syllabus
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl">
              Your roadmap to success — explore exams, subjects, and detailed topics.
            </p>
          </div>
          <button
            onClick={() => (window.location.href = '/api/dashboard/syllabus?download=1')}
            className="group flex items-center justify-center gap-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl px-5 py-3 transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            <Download size={18} className="group-hover:animate-bounce" />
            <span className="font-semibold">Download Catalog</span>
          </button>
        </header>

        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-4 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm text-base"
            placeholder="Search exams (e.g., JEE, NEET, UPSC)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-10">
            {/* Pinned Exams Section */}
            {pinned.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-blue-600 dark:text-cyan-400 font-bold uppercase tracking-wider text-sm">
                  <Pin size={16} className="fill-current" />
                  <h2>Pinned Exams</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {pinned.map((exam) => (
                    <div
                      key={exam.id}
                      className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-blue-500/30 dark:hover:border-cyan-500/30 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2.5 bg-blue-50 dark:bg-cyan-950/30 rounded-xl text-blue-600 dark:text-cyan-400">
                          <BookOpen size={24} />
                        </div>
                        <button
                          onClick={() => togglePin(exam.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          title="Unpin exam"
                        >
                          <Pin size={18} className="fill-current text-blue-500 dark:text-cyan-400" />
                        </button>
                      </div>
                      
                      <Link href={`/dashboard/syllabus/${exam.id}`} className="block mb-4">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                          {exam.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <BookOpen size={14} /> {exam.subjects} Subjects
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock size={14} /> {exam.durationMins}m
                          </span>
                        </div>
                      </Link>

                      <Link
                        href={`/dashboard/syllabus/${exam.id}`}
                        className="flex items-center justify-between w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-cyan-950/30 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors"
                      >
                        View Syllabus
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* All Exams Section */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                All Exams
                <span className="text-sm font-normal text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                  {list.length}
                </span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {list.map((exam) => (
                  <div
                    key={exam.id}
                    className="flex flex-col bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                          {exam.name}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Total Marks: <span className="font-medium text-slate-700 dark:text-slate-300">{exam.totalMarks}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => togglePin(exam.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          exam.pinned
                            ? 'text-blue-500 dark:text-cyan-400 bg-blue-50 dark:bg-cyan-950/30'
                            : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Pin size={18} className={exam.pinned ? 'fill-current' : ''} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 mb-5 text-sm text-slate-500 dark:text-slate-400">
                      <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md font-medium text-xs">
                        {exam.subjects} Subjects
                      </span>
                      <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md font-medium text-xs">
                        {exam.durationMins} Mins
                      </span>
                    </div>

                    <div className="mt-auto grid grid-cols-2 gap-3">
                      <Link
                        href={`/dashboard/syllabus/${exam.id}`}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                      >
                        View
                      </Link>
                      <a
                        href={exam.downloadUrl || `/api/dashboard/syllabus/${exam.id}?download=1`}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Download size={16} />
                        PDF
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {list.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white dark:bg-slate-900/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full mb-4">
                    <Search size={32} className="text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                    No exams found
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                    We couldn't find any exams matching "{query}". Try searching for something else.
                  </p>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  )
}
