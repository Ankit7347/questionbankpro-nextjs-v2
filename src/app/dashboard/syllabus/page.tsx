'use client'

import { useEffect, useState } from 'react'
import { Eye, BookOpen } from 'lucide-react'

import { fetchDashboardSyllabus } from '@/services/client/syllabus.client'
import { SyllabusDTO } from '@/dto/syllabus.ui.dto'

export default function DashboardSyllabusPage() {
  const [data, setData] = useState<SyllabusDTO | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function loadSyllabus() {
      try {
        const res = await fetchDashboardSyllabus()
        if (res?.success && res.data && mounted) {
          setData(res.data)
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

  if (loading) {
    // Kept skeleton structure but reduced spacing to match new layout
    return (
      <main className="bg-white dark:bg-slate-950 px-6 py-8 animate-pulse">
        <div className="max-w-4xl mx-auto space-y-8">
          <header className="space-y-2">
            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
          </header>
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
    <main className="bg-white dark:bg-slate-950 px-6 py-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8"> {/* Reduced from space-y-12 */}
        {/* Header */}
        <header>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium text-xs uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{data.exam.title}</span>
          </div>
          <h1 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white"> {/* Reduced text size and mt */}
            {data.subExam.title}
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Official syllabus outline (read-only).
          </p>
        </header>

        {/* Subjects Loop */}
        <div className="space-y-10"> {/* Reduced from space-y-16 */}
          {data.subjects.map((subject) => (
            <section key={subject.slug} className="space-y-6"> {/* Reduced from space-y-10 */}
              {/* Subject Title */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-1">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {subject.title}
                </h2>
              </div>

              {/* Chapters Stacked */}
              <div className="space-y-6"> {/* Reduced from space-y-10 */}
                {subject.chapters.map((chapter, index) => (
                  <div key={chapter.id} className="space-y-2"> {/* Reduced from space-y-3 */}
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
          ))}
        </div>

        {/* Footer */}
        <footer className="pt-6 border-t border-slate-100 dark:border-slate-900 text-[10px] text-slate-400 flex justify-between items-center">
          <span>Official Structure</span>
          <span>Last updated {new Date().getFullYear()}</span>
        </footer>
      </div>
    </main>
  )
}