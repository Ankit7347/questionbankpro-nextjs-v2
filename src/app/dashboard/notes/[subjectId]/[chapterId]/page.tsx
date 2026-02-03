// src/app/dashboard/notes/[subjectId]/[chapterId]/page.tsx
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Download, Clock } from 'lucide-react';

interface Topic {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Moderate' | 'Complex';
  readTime: string;
  isCompleted: boolean;
}

async function getChapterDetails(subjectId: string, chapterId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/dashboard/notes/${subjectId}/${chapterId}`, { cache: 'no-store' });
  if (!res.ok) return { topics: [] };
  return res.json();
}

export default async function ChapterPage({ params }: { params: Promise<{ subjectId: string; chapterId: string }> }) {
  const { subjectId, chapterId } = await params;
  const data = await getChapterDetails(subjectId, chapterId);
  const topics: Topic[] = data.topics;

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'bg-emerald-500';
      case 'Moderate': return 'bg-yellow-500';
      case 'Complex': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="bg-slate-950 text-slate-200 p-4 md:p-6 pb-24">
      {/* Header */}
      <header className="mb-8">
        <Link href={`/dashboard/notes/${subjectId}`} className="inline-flex items-center text-sm text-slate-400 hover:text-cyan-400 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to {subjectId}
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-white capitalize">{chapterId.replace('-', ' ')}</h1>
            <p className="text-slate-400 text-sm mt-1">3 Topics &bull; 32 min read</p>
          </div>
          <button className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition-all">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Summary Card */}
      <div className="mb-8 p-5 rounded-xl bg-gradient-to-br from-slate-900 to-slate-900/50 border border-slate-800">
        <h3 className="text-sm font-semibold text-cyan-400 mb-2 uppercase tracking-wider">Chapter Overview</h3>
        <p className="text-sm text-slate-300 leading-relaxed">
          This chapter covers the fundamental principles of energy exchange, including the zeroth, first, and second laws.
        </p>
      </div>

      {/* Topic Timeline */}
      <div className="relative space-y-8 pl-4">
        {/* Vertical Line */}
        <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-slate-800" />

        {topics.map((topic, index) => (
          <Link key={topic.id} href={`/dashboard/notes/${subjectId}/${chapterId}/${topic.id}`}>
            <div className="relative flex items-center gap-4 group cursor-pointer">
              {/* Dot Indicator */}
              <div className={`z-10 w-6 h-6 rounded-full border-4 border-slate-950 ${topic.isCompleted ? 'bg-cyan-500' : 'bg-slate-700 group-hover:bg-cyan-400'} transition-colors`} />
              
              {/* Card */}
              <div className="flex-1 p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:bg-slate-900 hover:border-cyan-500/30 transition-all">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">{topic.title}</h4>
                  <div className={`w-2 h-2 rounded-full ${getDifficultyColor(topic.difficulty)}`} title={topic.difficulty} />
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {topic.readTime}
                  </span>
                  {topic.isCompleted && (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <FileText className="w-3 h-3" /> Read
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}