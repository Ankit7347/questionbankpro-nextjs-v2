// src/app/dashboard/syllabus/[subjectSlug]/page.tsx
'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react'

type ChapterDTO = {
  id: string
  title: string
  slug: string
  topicsCount: number
}

async function loadChapters(subjectSlug: string) {
  const res = await fetch(`/api/dashboard/syllabus/${subjectSlug}`)
  return res.json()
}

export default function SubjectPage({ params }: { params: Promise<{ subjectSlug: string }> }) {
  const { subjectSlug } = use(params)
  const [items, setItems] = useState<ChapterDTO[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadChapters(subjectSlug).then(res => {
      if (res.success) setItems(res.data)
      setLoading(false)
    })
  }, [subjectSlug])

  return (
    <main className="p-6">
      <Link href="/dashboard/syllabus" className="flex items-center gap-2 mb-8">
        <ChevronLeft size={18} /> Back
      </Link>

      <h1 className="text-3xl font-bold mb-6">Chapters</h1>

      {loading && <div>Loading...</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.id} className="p-5 border rounded-xl">
            <h3 className="text-lg font-bold">{item.title}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-2 mb-4">
              <Layers size={14} /> {item.topicsCount} Topics
            </p>

            <Link
              href={`/dashboard/syllabus/${subjectSlug}/${item.slug}`}
              className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl"
            >
              Open <ChevronRight size={16} />
            </Link>
          </div>
        ))}
      </div>
    </main>
  )
}
