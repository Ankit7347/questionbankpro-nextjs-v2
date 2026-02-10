'use client'

import { useEffect, useState, useMemo } from 'react'
import { Eye, BookOpen, FileText, ExternalLink } from 'lucide-react'

import { fetchDashboardSyllabus } from '@/services/client/syllabus.client'
import { SyllabusDTO } from '@/dto/syllabus.ui.dto'

export default function DashboardSyllabusPage() {
  const [data, setData] = useState<SyllabusDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSubjectSlug, setActiveSubjectSlug] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function loadSyllabus() {
      try {
        const res = await fetchDashboardSyllabus()
        if (res?.success && res.data && mounted) {
          setData(res.data)
          if (res.data.subjects.length > 0) {
            setActiveSubjectSlug(res.data.subjects[0].slug)
          }
        }
      } catch (err) {
        console.error('Syllabus fetch failed:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadSyllabus()
    return () => { mounted = false }
  }, [])

  const visibleSubject = useMemo(() => {
    return data?.subjects.find(s => s.slug === activeSubjectSlug)
  }, [data, activeSubjectSlug])

  if (loading) {
    return (
      <main className="px-6 py-8 animate-pulse">
        <div className="max-w-4xl mx-auto space-y-8">
          <header className="space-y-2">
            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
          </header>
          <div className="h-10 w-full bg-slate-100 dark:bg-slate-900 rounded-md" />
          <div className="space-y-8">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-slate-100 dark:bg-slate-900 rounded" />
            ))}
          </div>
        </div>
      </main>
    )
  }

  if (!data || !data.subjects.length) {
    return (
      <main className="flex items-center justify-center min-h-[60vh] text-slate-500">
        <p className="text-lg font-medium">No syllabus available.</p>
      </main>
    )
  }

  return (
    <main className="px-6 py-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium text-xs uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{data.exam.title}</span>
          </div>
          <h1 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">
            {data.subExam.title}
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Official syllabus outline (read-only).
          </p>
        </header>

        {/* Subject Navigation - Scrollable on mobile if many subjects */}
        <div className="flex gap-2 p-1 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar">
          {data.subjects.map((subject) => (
            <button
              key={subject.slug}
              onClick={() => setActiveSubjectSlug(subject.slug)}
              className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-all duration-200 ${
                activeSubjectSlug === subject.slug
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {subject.title}
            </button>
          ))}
        </div>

        {/* Render Content Area */}
        <div className="space-y-10 min-h-[50vh]">
          {visibleSubject && (
            <section key={visibleSubject.slug} className="space-y-6 animate-in fade-in slide-in-from-bottom-1 duration-300">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-1">
                <h2 className="text-xl text-center font-bold text-slate-900 dark:text-white">
                  Table of Contents
                </h2>
              </div>

              <div className="space-y-6">
                {visibleSubject.chapters.map((chapter, index) => (
                  <div key={chapter.id} className="space-y-2">
                    <h3 className="text-md font-semibold text-slate-700 dark:text-slate-300">
                      Unit {index + 1}: {chapter.title}
                    </h3>

                    <ul className="divide-y divide-slate-50 dark:divide-slate-900/50">
                      {chapter.topics.map((topic) => (
                        <li
                          key={topic.id}
                          className="group flex items-center justify-between py-2 px-1 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 rounded transition-all"
                        >
                          <span className="text-slate-600 dark:text-slate-400 text-sm group-hover:text-blue-600 transition-colors">
                            {topic.title}
                          </span>

                          <a
                            href={topic.url}
                            className="p-1 text-slate-400 hover:text-blue-600 transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Optional Official Document Section */}
          {(data as any).pdfUrl && (
             <div className="mt-12 p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Official Curriculum PDF</h4>
                    <p className="text-xs text-slate-500">Download the full official notification.</p>
                  </div>
                </div>
                <a 
                  href={(data as any).pdfUrl} 
                  target="_blank" 
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Document <ExternalLink className="w-3 h-3" />
                </a>
             </div>
          )}
        </div>

        {/* Footer */}
        <footer className="pt-6 border-t border-slate-100 dark:border-slate-900 text-[10px] text-slate-500 flex justify-between items-center">
          <span>Official Structure</span>
          <span>Last updated {new Date().getFullYear()}</span>
        </footer>
      </div>
    </main>
  )
}