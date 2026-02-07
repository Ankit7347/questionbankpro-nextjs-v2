// src/app/dashboard/syllabus/page.tsx
/**
 * Dashboard → Syllabus Page
 * ========================
 *
 * Responsibility:
 * - Display syllabus structure (subjects list)
 *
 * Data source:
 * - fetchDashboardSyllabus()
 * - DTO: SyllabusSubjectDTO (server/domain owned)
 */

'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, ChevronRight } from 'lucide-react'

import { fetchDashboardSyllabus } from '@/services/client/syllabus.client'
import { SyllabusSubjectDTO } from '@/models/dto/syllabusSubject.dto'

export default function DashboardSyllabusPage() {
  const [items, setItems] = useState<SyllabusSubjectDTO[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadSyllabus() {
      try {
        setLoading(true)

        const res = await fetchDashboardSyllabus()

        if (!res.success || !res.data) {
          console.error('Failed to fetch syllabus:', res.error)
          return
        }

        if (mounted) {
          setItems(res.data)
        }
      } catch (err) {
        console.error('Unexpected syllabus error:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadSyllabus()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <main className="p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <header>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            Syllabus
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Official syllabus for your enrolled exam
          </p>
        </header>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-40 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && items.length === 0 && (
          <div className="py-20 text-center text-slate-500">
            No syllabus content found.
          </div>
        )}

        {/* Syllabus Subjects */}
        {!loading && items.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
              Subjects ({items.length})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map(item => (
                <SyllabusItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

/* =========================================================
   Card Component
========================================================= */

function SyllabusItemCard({ item }: { item: SyllabusSubjectDTO }) {
  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 border rounded-2xl p-5">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
        {item.title}
      </h3>

      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <BookOpen size={14} />
        {item.chaptersCount} Chapters
      </div>

      <Link
        href={`/dashboard/syllabus/${item.slug}`}
        className="mt-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition"
      >
        Open
        <ChevronRight size={16} />
      </Link>
    </div>
  )
}
