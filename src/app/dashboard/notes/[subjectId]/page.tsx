// src/app/dashboard/notes/[subjectId]/page.tsx
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Book, CheckCircle2, Circle } from 'lucide-react';

interface Chapter {
  id: string;
  title: string;
  description: string;
  progress: number;
  totalTopics: number;
  completedTopics: number;
}

async function getSubjectDetails(subjectId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/dashboard/notes/${subjectId}`, { cache: 'no-store' });
  if (!res.ok) return { chapters: [] };
  return res.json();
}

export default async function SubjectPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = await params;
  const data = await getSubjectDetails(subjectId);
  const chapters: Chapter[] = data.chapters;

  return (
    <div className="bg-slate-950 text-slate-200 p-4 md:p-6 pb-24">
      {/* Header */}
      <header className="mb-8">
        <Link href="/dashboard/notes" className="inline-flex items-center text-sm text-slate-400 hover:text-cyan-400 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Library
        </Link>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-white capitalize">{subjectId}</h1>
            <p className="text-slate-400 mt-1">Master the curriculum chapter by chapter.</p>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-2xl font-bold text-cyan-400">45%</div>
            <div className="text-xs text-slate-500">Total Completion</div>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="mt-6 w-full bg-slate-900 rounded-full h-2">
          <div className="bg-cyan-500 h-2 rounded-full transition-all duration-500" style={{ width: '45%' }} />
        </div>
      </header>

      {/* Chapter List */}
      <div className="space-y-4">
        {chapters.map((chapter) => (
          <Link key={chapter.id} href={`/dashboard/notes/${subjectId}/${chapter.id}`}>
            <div className="group bg-slate-900/40 border border-slate-800 rounded-xl p-5 hover:border-cyan-500/30 hover:bg-slate-900/60 transition-all cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {chapter.progress === 100 ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  ) : chapter.progress > 0 ? (
                    <div className="relative w-6 h-6 flex items-center justify-center">
                       <Circle className="w-6 h-6 text-slate-700" />
                       <span className="absolute text-[10px] font-bold text-cyan-400">{chapter.progress}%</span>
                    </div>
                  ) : (
                    <Circle className="w-6 h-6 text-slate-700" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                      {chapter.title}
                    </h3>
                    <span className="text-xs text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                      {chapter.completedTopics}/{chapter.totalTopics} Topics
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{chapter.description}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}