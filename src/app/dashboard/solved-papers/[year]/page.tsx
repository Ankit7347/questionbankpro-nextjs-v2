import React from 'react';
import Link from 'next/link';
import { Search, Calendar, ChevronLeft } from 'lucide-react';

interface SolvedPaperCard {
  id: string;
  title: string;
  subject: string;
  year: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionCount: number;
  views: number;
  isVerified?: boolean;
}

interface PageProps {
  params: Promise<{
    year: string;
  }>;
}

export default async function YearSolvedPapersPage({ params }: PageProps) {
  const { year } = await params;

  // Server-side fetch to our API route
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/dashboard/solved-papers/${year}`, { cache: 'no-store' });
  const json = await res.json();

  const papers: SolvedPaperCard[] = json?.papers ?? [];
  const metrics = json?.metrics ?? { avgDifficulty: 'Medium', solvedCount: papers.length };

  return (
    <div className="bg-slate-950 text-slate-200 p-4 md:p-8 font-serif">
      <header className="mb-6">
        <Link href="/dashboard/solved-papers" className="inline-flex items-center text-slate-400 hover:text-cyan-300 transition-colors mb-4">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Solved Papers
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-1 flex items-center gap-3">
              <Calendar className="w-8 h-8 text-cyan-400" /> {year} — Verified Solutions
            </h1>
            <p className="text-slate-400">Browse verified solved papers for the year {year}. Toggle quality on the paper viewer for Detailed vs Brief solutions.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-3 text-center min-w-[140px]">
              <p className="text-xs text-slate-400 uppercase">Avg Difficulty</p>
              <p className="font-semibold text-white">{metrics.avgDifficulty}</p>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-3 text-center min-w-[140px]">
              <p className="text-xs text-slate-400 uppercase">Papers</p>
              <p className="font-semibold text-white">{metrics.solvedCount}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-500" />
            </div>
            <input
              placeholder="Search subject or topic within this year..."
              className="block w-full pl-10 pr-4 py-3 border border-slate-800 rounded-xl bg-slate-900/60 text-slate-300 placeholder-slate-500 focus:outline-none h-12"
            />
          </div>
        </div>
      </header>

      <main className="grid gap-4">
        {papers.map((p) => (
          <Link
            key={p.id}
            href={`/dashboard/solved-papers/${year}/${p.id}`}
            className="group bg-slate-900/40 border border-slate-800 rounded-xl p-5 flex items-center justify-between gap-4 hover:border-cyan-400/30 transition"
          >
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 truncate">{p.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{p.subject} • {p.year} • {p.difficulty}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-slate-400">Questions</div>
                <div className="font-medium text-white">{p.questionCount}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Views</div>
                <div className="font-medium text-white">{p.views}</div>
              </div>
            </div>
          </Link>
        ))}

        {papers.length === 0 && (
          <div className="p-6 bg-slate-900/30 border border-slate-800 rounded-xl text-slate-400">No solved papers found for {year}.</div>
        )}
      </main>
    </div>
  );
}
