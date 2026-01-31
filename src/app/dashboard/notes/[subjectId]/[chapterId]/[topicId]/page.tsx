// src/app/dashboard/notes/[subjectId]/[chapterId]/[topicId]/page.tsx
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, ChevronLeft, Bookmark } from 'lucide-react';

async function getTopicContent(subjectId: string, chapterId: string, topicId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/dashboard/notes/${subjectId}/${chapterId}/${topicId}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function TopicReaderPage({ params }: { params: Promise<{ subjectId: string; chapterId: string; topicId: string }> }) {
  const { subjectId, chapterId, topicId } = await params;
  const data = await getTopicContent(subjectId, chapterId, topicId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-24">
      {/* Sticky Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-900 z-50">
        <div className="h-full bg-cyan-400 w-[30%]" /> {/* Dynamic width based on scroll */}
      </div>

      {/* Navigation Header */}
      <nav className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur border-b border-slate-800 px-4 py-3 flex justify-between items-center">
        <Link href={`/dashboard/notes/${subjectId}/${chapterId}`} className="text-slate-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="text-sm font-medium text-white truncate max-w-[200px]">
          {data?.content?.title || topicId}
        </div>
        <button className="text-slate-400 hover:text-cyan-400">
          <Bookmark className="w-5 h-5" />
        </button>
      </nav>

      {/* Content Area */}
      <article className="max-w-2xl mx-auto px-5 py-8 prose prose-invert prose-slate prose-headings:text-white prose-p:text-slate-300 prose-strong:text-cyan-400">
        <h1>{data?.content?.title}</h1>
        <p>
          {data?.content?.markdown}
        </p>
        
        {/* Interactive Block: Definition */}
        <div className="not-prose my-8 p-5 rounded-xl bg-slate-900/50 border border-l-4 border-slate-800 border-l-cyan-500">
          <h4 className="text-sm font-bold text-cyan-400 uppercase mb-2">Definition</h4>
          <p className="text-slate-200 italic">
            "Energy cannot be created or destroyed, only transformed."
          </p>
        </div>

        <h2>The Zeroth Law</h2>
        <p>
          The Zeroth Law of Thermodynamics states that if two thermodynamic systems are each in thermal equilibrium with a third, then they are in thermal equilibrium with each other.
        </p>
      </article>

      {/* Floating Navigation Footer */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-full px-6 py-3 shadow-2xl z-40">
        <button className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-medium text-slate-500">Topic 1 of 3</span>
        <button className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}