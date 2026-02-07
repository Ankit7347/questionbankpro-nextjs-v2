// src/app/dashboard/syllabus/[subjectSlug]/[chapterSlug]/page.tsx
'use client'

import React, { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, CircleDot } from 'lucide-react'

/* ---------------------------------------------------------
   LOCAL DTO
--------------------------------------------------------- */
type TopicDTO = {
  id: string
  title: string
  slug: string
}

/* ---------------------------------------------------------
   LOCAL CLIENT FETCH
--------------------------------------------------------- */
async function fetchTopics(subjectSlug: string, chapterSlug: string) {
  const res = await fetch(`/api/dashboard/syllabus/${subjectSlug}/${chapterSlug}`)
  return res.json()
}

/* ---------------------------------------------------------
   PAGE
--------------------------------------------------------- */
export default function SyllabusChapterPage({
  params,
}: {
  params: Promise<{ subjectSlug: string; chapterSlug: string }>
}) {
  const { subjectSlug, chapterSlug } = use(params)
  const [items, setItems] = useState<TopicDTO[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetchTopics(subjectSlug, chapterSlug)
      if (res.success) setItems(res.data)
      setLoading(false)
    }
    load()
  }, [subjectSlug, chapterSlug])

  return (
    <main className="p-6 bg-gray-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Back Button */}
        <Link
          href={`/dashboard/syllabus/${subjectSlug}`}
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300"
        >
          <ChevronLeft size={18} /> Back to Chapters
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Topics
        </h1>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map(item => (
              <Link
                key={item.id}
                href={`/dashboard/syllabus/${subjectSlug}/${chapterSlug}/${item.slug}`}
                className="flex items-center gap-3 bg-white dark:bg-slate-900 border p-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <CircleDot size={18} className="text-blue-600" />
                <span className="text-slate-900 dark:text-white font-medium">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
