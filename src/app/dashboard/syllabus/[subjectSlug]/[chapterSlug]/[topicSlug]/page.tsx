// src/app/dashboard/syllabus/[subjectSlug]/[chapterSlug]/[topicSlug]/page.tsx
'use client'

import React, { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, FileText } from 'lucide-react'

/* ---------------------------------------------------------
   LOCAL DTO
--------------------------------------------------------- */
type TopicContentDTO = {
  id: string
  title: string
  content: string
}

/* ---------------------------------------------------------
   LOCAL CLIENT FETCH
--------------------------------------------------------- */
async function fetchTopicContent(subjectSlug: string, chapterSlug: string, topicSlug: string) {
  const res = await fetch(`/api/dashboard/syllabus/${subjectSlug}/${chapterSlug}/${topicSlug}`)
  return res.json()
}

/* ---------------------------------------------------------
   PAGE
--------------------------------------------------------- */
export default function TopicPage({
  params,
}: {
  params: Promise<{ subjectSlug: string; chapterSlug: string; topicSlug: string }>
}) {
  const { subjectSlug, chapterSlug, topicSlug } = use(params)
  const [item, setItem] = useState<TopicContentDTO | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetchTopicContent(subjectSlug, chapterSlug, topicSlug)
      if (res.success) setItem(res.data)
      setLoading(false)
    }
    load()
  }, [subjectSlug, chapterSlug, topicSlug])

  return (
    <main className="p-6 bg-gray-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Back */}
        <Link
          href={`/dashboard/syllabus/${subjectSlug}/${chapterSlug}`}
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300"
        >
          <ChevronLeft size={18} /> Back to Topics
        </Link>

        {/* Loading */}
        {loading && (
          <div className="h-40 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
        )}

        {/* Content */}
        {!loading && item && (
          <>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText size={28} /> {item.title}
            </h1>

            <article
              className="prose dark:prose-invert prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          </>
        )}
      </div>
    </main>
  )
}
